<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class FolderTarget extends Model
{
    protected $fillable = [
        "folder_id",
        "company_id",
        "job_position_id",
        "order"
    ];

    protected $appends = ["audience_label"];

    protected function casts(): array
    {
        return [
            'order' => "integer",
        ];
    }
    
    public function scopeForEmployee($query, User $user): void
    {
        $query->where(function ($q) use ($user) {
            $q->where("company_id", $user->company_id)
                ->orWhereNull("company_id");
        })
        ->where(function ($q) use ($user) {
            $q->where("job_position_id", $user->job_position_id)
                ->orWhereNull("job_position_id");
        });
    }

    public function scopeGlobal($query): void
    {
        $query->whereNull("company_id")
              ->whereNull("job_position_id");
    }

    public function isGlobal(): bool
    {
        return $this->company_id === null
            && $this->job_position_id === null;
    }

    public function audienceLabel(): Attribute
    {
        return Attribute::make(
            get: function () {
                if ($this->isGlobal()) {
                    return "All employees";
                }
        
                $parts = [];
        
                if ($this->company_id) {
                    $parts[] = $this->company?->name ?? "Unknown company";
                } else {
                    $parts[] = "All companies";
                }
        
                if ($this->job_position_id) {
                    $parts[] = $this->jobPosition?->name ?? "Unknown position";
                } else {
                    $parts[] = "All positions";
                }
        
                return implode(" → ", $parts);
            }
        );
    }

    public function folder(): BelongsTo
    {
        return $this->belongsTo(Folder::class);
    }

    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    public function jobPosition(): BelongsTo
    {
        return $this->belongsTo(JobPosition::class);
    }
}