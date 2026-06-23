<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Slide extends Model
{
    protected $fillable = [
        "company_id",
        "image_path",
        "order",
    ];

    protected function casts(): array
    {
        return [
            "order" => "integer",
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

    public function isAcknowledgedBy(User $user): bool
    {
        return $this->acknowledgements()->where("user_id", $user->id)->exists();
    }
}