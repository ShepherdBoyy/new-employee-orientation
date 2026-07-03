<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Folder extends Model
{
    protected $fillable = [
        "name",
        "order"
    ];

    protected function casts(): array
    {
        return [
            "order" => "integer"
        ];
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
