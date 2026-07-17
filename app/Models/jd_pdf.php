<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class jd_pdf extends Model
{
    protected $fillable = [
        'company_id',
        'job_position_id',
        'file_path',
        'orig_name'
    ];
}
