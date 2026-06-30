<?php

namespace App\Http\Controllers\Employee;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;

use Inertia\Inertia;

class EmployeeController extends Controller
{
    public function Index()
    {
        $companyId = 2;

        $companyPaths = [
            1 => 'Assets/Images/PMC_NEO',
            2 => 'Assets/Images/PPI_NEO',
        ];

        $path = public_path($companyPaths[$companyId] ?? 'Assets/Images/Default');

        $files = File::files($path);
        $count = count($files);

        $relativePath = Str::after($path, public_path() . DIRECTORY_SEPARATOR);

        return Inertia::render('Employee/Index', [
            'maxFileCount' => $count,
            'path' => $relativePath,
        ]);
    }

    public function Acknowledge (Request $request) {
        $validated = $request->validate([
            ''
        ]);
    } 
}
