<?php

namespace App\Http\Controllers\Employee;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;

use Inertia\Inertia;

class EmployeeController extends Controller
{
    public function Index () {
        $path = public_path('Assets/Images/PMC_NEO'); // adjust path as needed
        $files = File::files($path);
        $count = count($files);

        return Inertia::render('Employee/Index')->with(['maxFileCount' => $count]);
    }

    public function Acknowledge (Request $request) {
        $validated = $request->validate([
            ''
        ]);
    } 
}
