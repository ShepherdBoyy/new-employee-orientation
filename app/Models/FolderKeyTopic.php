<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Storage;
use Str;

class FolderKeyTopic extends Model
{
    protected $fillable = [
        "folder_id",
        "label",
        "order"
    ];

    protected function casts(): array
    {
        return [
            "order" => "integer"
        ];
    }

    protected static function booted(): void
    {
        static::creating(function (FolderKeyTopic $topic) {
            if (empty($topic->slug)) {
                $topic->slug = static::generateUniqueSlug($topic->label, $topic->folder_id);
            }
        });

        static::updating(function (FolderKeyTopic $topic) {
            if ($topic->isDirty("label") && $topic->isDirty("slug")) {
                $topic->slug = static::generateUniqueSlug($topic->label, $topic->folder_id, $topic->id);
            }
        });

        static::deleting(function (FolderKeyTopic $topic) {
            $topic->slides->each(function ($slide) {
                Storage::disk(config("filesystems.default"))->delete($slide->file_path);
            });
        });
    }

    protected static function generateUniqueSlug(string $label, int $folderId, ?int $ignoreId = null): string
    {
        $slug = Str::slug($label);
        $original = $slug;
        $count = 1;

        while (
            static::where("folder_id", $folderId)
                ->where("slug", $slug)
                ->when($ignoreId, fn($q) => $q->where("id", "!=", $ignoreId))
                ->exists()
        ) {
            $slug = $original . "-" . $count++;
        }

        return $slug;
    }

    public function scopeOrdered($query): void
    {
        $query->orderedBy("order");
    }

    public function folder(): BelongsTo
    {
        return $this->belongsTo(Folder::class);
    }

    public function slides(): HasMany
    {
        return $this->hasMany(Slide::class)->orderBy("order");
    }
}
