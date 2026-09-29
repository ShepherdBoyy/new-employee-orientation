<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class AuditLog extends Model
{
    const UPDATED_AT = null;

    protected $fillable = [
        "user_id",
        "user_name",
        "user_role",
        "action",
        "subject_type",
        "subject_id",
        "description",
        "old_values",
        "new_values",
        "ip_address",
        "user_agent"
    ];

    protected function casts(): array
    {
        return [
            "old_values" => "array",
            "new_values" => "array",
            "created_at" => "datetime",
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function subject(): MorphTo
    {
        return $this->morphTo();
    }
}
