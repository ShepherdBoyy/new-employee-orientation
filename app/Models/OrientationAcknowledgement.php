<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Storage;
use URL;

class OrientationAcknowledgement extends Model
{
    public $timestamps = false;

    protected $fillable = [
        "user_id",
        "full_name_confirmation",
        "signature_path",
        "photo_path",
        "integrity_hash",
        "ip_address",
        "user_agent",
        "acknowledged_at"
    ];

    protected $hidden = [
        "signature_path",
        "photo_path",
        "integrity_hash"
    ];

    protected function casts(): array
    {
        return [
            "acknowledged_at" => "datetime"
        ];
    }

    public static function generateHash(
        int $userId,
        string $fullName,
        string $signaturePath,
        string $photoPath,
        string $acknowledgedAt
    ): string {
        return hash("sha256", implode("|", [
            $userId,
            $fullName,
            $signaturePath,
            $photoPath,
            $acknowledgedAt
        ]));
    }
    
    public function verifyIntegrity(): bool
    {
        $expectedHash = self::generateHash(
            $this->user_id,
            $this->full_name_confirmation,
            $this->signature_path,
            $this->photo_path,
            $this->acknowledged_at->toDateString()
        );

        return hash_equals($expectedHash, $this->integrity_hash);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}