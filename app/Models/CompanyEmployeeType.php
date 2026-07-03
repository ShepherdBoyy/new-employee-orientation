<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CompanyEmployeeType extends Model
{
    protected $fillable = [
        "company_id",
        "employee_type"
    ];

    protected function casts(): array
    {
        return [
            "employee_type" => "string"
        ];
    }

    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }
}