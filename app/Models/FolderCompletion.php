<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class FolderCompletion extends Model
{
    public $timestamps = false;

    protected $fillable = [
        "user_id",
        "folder_id",
        "completed_at"
    ];

    protected function casts(): array
    {
        return [
            "completed_at" => "datetime"
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function folder(): BelongsTo
    {
        return $this->belongsTo(Folder::class);
    }
}
