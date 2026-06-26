<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
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

    public function companySlides(): BelongsToMany
    {
        return $this->belongsToMany(Slide::class, "company_slides")
            ->withPivot("order")
            ->withTimestamps()
            ->orderByPivot("order");
    }

    public function ownSlides(): HasMany
    {
        return $this->hasMany(Slide::class)->orderBy("order");
    }

    public function orientationSlides()
    {
        $companySlides = $this->companySlides;

        $globalSlides = Slide::global()
            ->orderBy("order")
            ->get();
        
        return $companySlides->concat($globalSlides);
    }
}
