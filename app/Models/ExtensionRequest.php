<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ExtensionRequest extends Model
{
    public $timestamps = false;

    protected $fillable = [
        "user_id",
        "reason",
        "status",
        "requested_at",
        "resolved_at",
    ];

    protected function casts(): array
    {
        return [
            "status" => "string",
            "requested_at" => "datetime",
            "resolved_at" => "datetime"
        ];
    }

    public function isPending(): bool
    {
        return $this->status === "pending";
    }

    public function isApproved(): bool
    {
         return $this->status === "approved";
    }

    public function isDenied(): bool
    {
        return $this->status === "denied";
    }

    public function isResolved(): bool
    {
        return $this->status !== "pending";
    }

    public function approve(): void
    {
        $this->update([
            "status" => "approved",
            "resolved_at" => now()
        ]);

        $this->user->update([
            "status" => "active",
            "expires_at" => now()->addHours(24)
        ]);
    }

    public function deny(): void
    {
        $this->update([
            "status" => "denied",
            "resolved_at" => now()
        ]);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
