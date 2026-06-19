<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Company extends Model
{
    protected $fillable = [
        "name",
        "slug",
        "logo_path",
        "status"
    ];

    protected function casts(): array
    {
        return ["status" => "string"];
    }

    public function users(): HasMany
    {
        return $this->hasMany(User::class);
    }

    public function slides(): HasMany
    {
        return $this->hasMany(Slide::class)->orderBy('order');
    }
}
