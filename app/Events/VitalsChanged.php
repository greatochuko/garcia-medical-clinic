<?php

namespace App\Events;

use App\Models\VitalSignsModal;
use Illuminate\Broadcasting\Channel;
use Illuminate\Queue\SerializesModels;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;

class VitalsChanged implements ShouldBroadcast
{
    use InteractsWithSockets, SerializesModels;

    public $vitals;
    public $type; // "created" or "updated"

    public function __construct(VitalSignsModal $vitals, $type)
    {
        $this->vitals = $vitals;
        $this->type = $type;
    }

    public function broadcastOn()
    {
        return new Channel('vitals');
    }

    public function broadcastAs()
    {
        return 'vitals.changed';
    }
}
