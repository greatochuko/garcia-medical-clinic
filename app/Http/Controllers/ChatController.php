<?php

namespace App\Http\Controllers;

use App\Events\MessageSent;
use App\Models\Message;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;

class ChatController extends Controller
{
    public function getOtherUsers()
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

    public function sendMessage(Request $request)
    {
        try {
            $validated = $request->validate([
                'receiver_id' => 'required|exists:users,id',
                'type' => 'required|in:text,emoji,transaction',
                'content' => 'nullable|string',
                'transaction' => 'nullable|json',
            ]);

            $message = Message::create([
                'sender_id' => Auth::id(),
                'receiver_id' => $validated['receiver_id'],
                'type' => $validated['type'],
                'content' => $validated['content'] ?? null,
                'transaction' => $validated['transaction'] ?? null,
            ]);

            event(new MessageSent($message));

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
}
