<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class MessageReadEvent implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $senderId;
    public $receiverId;

    public function __construct($senderId, $receiverId)
    {
        $this->senderId = $senderId;
        $this->receiverId = $receiverId;
    }

    public function broadcastOn()
    {
        return new \Illuminate\Broadcasting\Channel('chat'); // public channel
    }

    public function broadcastWith()
    {
        return [
            'sender_id' => $this->senderId,
            'receiver_id' => $this->receiverId,
        ];
    }

    public function broadcastAs()
    {
        return 'message.read';
    }
}
