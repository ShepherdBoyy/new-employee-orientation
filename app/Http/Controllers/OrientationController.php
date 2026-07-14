<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;

class OrientationController extends Controller
{
    public function index(): Response
    {
        return Inertia::render("Employee/Orientation");
    }
}
