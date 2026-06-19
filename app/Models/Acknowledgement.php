<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Acknowledgement extends Model
{
    public $timestamps = false;

    protected $fillable = [
        "user_id",
        "slide_id",
        "acknowledged_at"
    ];

    protected function casts(): array
    {
        return [
            "acknowledged_at" => "datetime"
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function slide(): BelongsTo
    {
        return $this->belongsTo(Slide::class);
    }
}
