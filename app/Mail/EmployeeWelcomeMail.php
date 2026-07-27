<?php

namespace App\Mail;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class EmployeeWelcomeMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public User $employee,
        public string $plainPassword
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Welcome to Your Orientation - ' . $this->employee->company?->name,
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.employee-welcome',
            with: [
                "employeeName" => $this->employee->name,
                "companyName" => $this->employee->company?->name,
                "jobPosition" => $this->employee->jobPosition?->name,
                "email " => $this->employee->email,
                "password" => $this->plainPassword,
                "loginUrl" => url("/login"),
                "expiresInDays" => 2
            ]
        );
    }
}