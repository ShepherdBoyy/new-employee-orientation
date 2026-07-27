<?php

namespace App\Notifications;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class OrientationCompleted extends Notification
{
    use Queueable;

    public function __construct(public User $employee) {}

    public function via(object $notifiable): array
    {
        return ["database"];
    }

    public function toArray(object $notifiable): array
    {
        return [
            "type" => "orientation_completed",
            "employee_id" => $this->employee->id,
            "employee_name" => $this->employee->name,
            "company_name" => $this->employee->company?->name,
            "message" => $this->employee->name . " has completed their orientation.",
            "completed_at" => now()->toDateTimeString()
        ];
    }
}
