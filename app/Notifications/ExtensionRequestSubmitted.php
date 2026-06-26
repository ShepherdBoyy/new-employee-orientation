<?php

namespace App\Notifications;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ExtensionRequestSubmitted extends Notification
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
            ->subject("Extension Request - " . $this->employee->name)
            ->greeting("Hello " . $notifiable->name . ",")
            ->line($this->employee->name . " has requested an account extension")
            ->line("Employee: " . $this->employee->name)
            ->line("Email: " . $this->employee->email)
            ->line("Requested_at: " . now()->format("F j, Y h:i A"))
            ->action("Review Request", url("/admin/extension-requests"));
    }

    public function toArray(object $notifiable): array
    {
        return [
            "type" => "extension_request_submitted",
            "employee_id" => $this->employee->id,
            "employee_name" => $this->employee->name,
            "message" => $this->employee->name . " has requested an account extension",
            'requested_at' => now()->toDateTimeString()
        ];
    }
}
