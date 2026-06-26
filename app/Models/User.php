<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use Notifiable;

    protected $fillable = [
        "company_id",
        "name",
        "email",
        "password",
        "role",
        "status",
        "expires_at"
    ];

    protected $hidden = [
        "password",
        "remember_token"
    ];

    protected function casts(): array
    {
        return [
            'password' => 'hashed',
            "expires_at" => "datetime",
            "status" => "string",
            "role" => "string"
        ];
    }

    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    public function acknowledgements(): HasMany
    {
        return $this->hasMany(Acknowledgement::class);
    }

    public function extensionRequests(): HasMany
    {
        return $this->hasMany(ExtensionRequest::class);
    }

    public function isAdmin(): bool
    {
        return $this->role === "admin";
    }

    public function isEmployee(): bool
    {
        return $this->role === "employee";
    }

    public function isActive(): bool
    {
        return $this->status === "active";
    }

    public function isLocked(): bool
    {
        return $this->status === "locked";
    }

    public function isExpired(): bool
    {
        return $this->expires_at !== null && $this->expires_at->isPast();
    }

    public function hasCompletedOrientation(): bool
    {
        if (!$this->isEmployee()) {
            return false;
        }

        if (!$this->relationLoaded("company")) {
            $this->load("company");
        }

        $allSlides = $this->company->orientationSlides();

        if ($allSlides->isEmpty()) {
            return false;
        }

        $allSlidesIds = $allSlides->pluck("id");
        $acknowledged = $this->acknowledgements()->pluck("slide_id");

        return $allSlidesIds->diff($acknowledged)->isEmpty();
    }
}
