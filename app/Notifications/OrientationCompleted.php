<?php

namespace App\Notifications;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class OrientationCompleted extends Notification
{
    use Queueable;

    public function __construct(public User $employee) {}

    public function via(object $notifiable): array
    {
        return ['mail', "database"];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject("Orientation Completed - " . $this->employee->name)
            ->greeting("Hello " . $notifiable->name . ",")
            ->line($this->employee->name . " has completed their orientation")
            ->line("Employee: " . $this->employee->name)
            ->line("Email: " . $this->employee->email)
            ->line("Completed at: " . now()->format("F j, Y h:i A"))
            ->action("View Dashboard", url("/admin/dashboard"));
    }

    public function toArray(object $notifiable): array
    {
        return [
            "type" => "orientation_completed",
            "employee_id" => $this->employee->id,
            "employee_name" => $this->employee->name,
            "message" => $this->employee->name . " has completed their orientation",
            "completed_at" => now()->toDateTimeString()
        ];
    }
}
