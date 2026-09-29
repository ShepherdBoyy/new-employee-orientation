<?php

namespace App\Support;

use App\Models\AuditLog;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;

class AuditLogger
{
    public static function record(
        string $action,
        string $description,
        ?Model $subject = null,
        array $oldValues = [],
        array $newValues = []
    ): AuditLog {
        $user = Auth::user();

        return AuditLog::create([
            "user_id" => $user?->id,
            "user_name" => $user?->name,
            "user_role" => $user?->role,
            "action" => $action,
            "subject_type" => $subject?->getMorphClass(),
            "subject_id" => $subject?->getKey(),
            "description" => $description,
            "old_values" => $oldValues ?: null,
            "new_values" => $newValues ?: null,
            "ip_address" => request()?->ip(),
            "user_agent" => request()?->userAgent()
        ]);
    }
}