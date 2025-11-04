<?php

namespace App\Http\Controllers;

use App\Events\MessageReadEvent;
use App\Events\MessageSent;
use App\Models\Message;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;

class ChatController extends Controller
{
    public function getChatUsers()
    {
        $userId = Auth::id();

        $users = User::where('id', '!=', Auth::id())
            ->select('id', 'first_name', 'last_name', 'middle_initial', 'avatar_url', 'role')
            ->get();

        $messages = Message::where(function ($query) use ($userId) {
            $query->where('sender_id', $userId)
                ->orWhere('receiver_id', $userId);
        })->orderBy('created_at', 'asc')
            ->get();

        return response()->json(["users" => $users, "messages" => $messages]);
    }

    public static function sendChatMessage($receiverId, $type, $content = null, $transaction = null, $tempId = null)
    {
        $message = Message::create([
            'sender_id' => Auth::id(),
            'receiver_id' => $receiverId,
            'type' => $type,
            'content' => $content,
            'temp_id' => $tempId,
            'transaction' => $transaction,
        ]);

        event(new MessageSent($message));

        return $message;
    }

    public function sendMessage(Request $request)
    {
        try {
            $validated = $request->validate([
                'receiver_id' => 'required|exists:users,id',
                'type' => 'required|in:text,emoji,transaction',
                'temp_id' => 'nullable|string',
                'content' => 'nullable|string',
                'transaction' => 'nullable|json',
            ]);

            $message = ChatController::sendChatMessage(
                $validated['receiver_id'],
                $validated['type'],
                $validated['content'] ?? null,
                $validated['transaction'] ?? null,
                $validated['temp_id'] ?? null,
            );

            return response()->json([
                'success' => true,
                'message' => 'Message sent successfully',
                'data' => $message,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Failed to send message: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function acknowledgeReceipt(Request $request, $id)
    {
        try {
            $message = Message::findOrFail($id);

            // Ensure only the receiver can acknowledge receipt
            if ($message->receiver_id !== Auth::id()) {
                return response()->json([
                    'success' => false,
                    'error' => 'Unauthorized to acknowledge this message.',
                ], 403);
            }

            $message->update(['isAcknowledged' => true]);

            // Optionally broadcast that the message was acknowledged
            event(new MessageSent($message));

            return response()->json([
                'success' => true,
                'message' => 'Message receipt acknowledged successfully.',
                'data' => $message,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Failed to acknowledge message: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function markAsRead(Request $request)
    {
        $validated = $request->validate([
            'sender_id' => 'required|exists:users,id',
        ]);

        Message::where('sender_id', $validated['sender_id'])
            ->where('receiver_id', Auth::id())
            ->where('is_read', false)
            ->update(['is_read' => true]);

        broadcast(new MessageReadEvent($validated['sender_id'], Auth::id()))->toOthers();

        return;
    }
}
