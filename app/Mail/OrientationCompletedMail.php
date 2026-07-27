<?php

namespace App\Mail;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Attachment;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class OrientationCompletedMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public User $employee,
        public string $acknowledgedAt
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Orientation Completed - ' . $this->employee->name,
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.orientation-completed',
            with: [
                "employeeName" => $this->employee->name,
                "employeeEmail" => $this->employee->email,
                "companyName" => $this->employee->company?->name,
                "jobPosition" => $this->employee->jobPosition?->name,
                "acknowledgedAt" => $this->acknowledgedAt,
                "viewUrl" => url("/admin/users/employees")
            ]
        );
    }
}
