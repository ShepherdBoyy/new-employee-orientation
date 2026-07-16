<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class Folder extends Model
{
    protected $fillable = [
        "name",
        "slug",
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
        static::creating(function (Folder $folder) {
            if (empty($folder->slug)) {
                $folder->slug = static::generateUniqueslug($folder->name);
            }
        });

        static::updating(function (Folder $folder) {
            if ($folder->isDirty("name") && !$folder->isDirty("slug")) {
                $folder->slug = static::generateUniqueSlug($folder->name, $folder->id);
            }
        });
    }

    protected static function generateUniqueSlug(string $name, ?int $ignoreId = null): string
    {
        $slug = Str::slug($name);
        $original = $slug;
        $count = 1;

        while (
            static::where("slug", $slug)
                ->when($ignoreId, fn($q) => $q->where("id", "!=", $ignoreId))
                ->exists()
        ) {
            $slug = $original . "-" . $count++;
        }

        return $slug;
    }

    public function scopeOrdered($query): void
    {
        $query->orderBy("order");
    }

    public function isCompletedBy(User $user): bool
    {
        return $this->completions()
                    ->where("user_id", $user->id)
                    ->exists();
    }

    public function slideCount(): int
    {
        return $this->slides()->count();
    }

    public function slides(): HasMany
    {
        return $this->hasMany(Slide::class)->orderBy("order");
    }

    public function targets(): HasMany
    {
        return $this->hasMany(FolderTarget::class);
    }

    public function completions(): HasMany
    {
        return $this->hasMany(FolderCompletion::class);
    }
}
