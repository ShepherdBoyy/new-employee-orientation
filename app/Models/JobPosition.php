<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class JobPosition extends Model
{
    protected $fillable = [
        "name"
    ];

    public function users(): HasMany
    {
        return $this->hasMany(User::class);
    }

    public function folderTargets(): HasMany
    {
        return $this->hasMany(FolderTarget::class);
    }
    public function companies(): BelongsToMany
    {
        return $this->belongsToMany(Company::class);
    }
}
