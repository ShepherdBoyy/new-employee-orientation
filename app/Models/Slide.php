<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Slide extends Model
{
    protected $fillable = [
        "folder_id",
        "type",
        "file_path",
        "order"
    ];

    protected function casts(): array
    {
        return [
            "order" => "integer",
            "type" => "string"
        ];
    }

    public function isImage(): bool
    {
        return $this->type === "image";
    }

    public function isVideo(): bool
    {
        return $this->type === "video";
    }

    public function fileUrl(): string
    {
        return match(config("filesystem.default")) {
            "s3" => \Storage::disk("s3")->temporaryUrl($this->file_path, now()->addMinutes(30)),
            default => asset("storage/" . $this->file_path),
        };
    }

    public function folder(): BelongsTo
    {
        return $this->belongsTo(Folder::class);
    }
}
