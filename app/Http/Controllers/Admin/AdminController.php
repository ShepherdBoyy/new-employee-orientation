<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Company;
use App\Models\ExtensionRequest;
use App\Models\User;
use Inertia\Inertia;
use Inertia\Response;

class AdminController extends Controller
{
    public function index(): Response
    {
        $totalCompanies = Company::count();
        $totalAdmins = User::where("role", "admin")->count();
        $totalEmployees = User::where("role", "employee")->count();
        $completedOrientation = User::where("role", "employee")
            ->get()
            ->filter(fn(User $user) => $user->hasCompletedOrientation())
            ->count();
        $pendingExtensions = ExtensionRequest::where("status", "pending")->count();

        return Inertia::render("Admin/Dashboard", [
            "stats" => [
                "totalCompanies" => $totalCompanies,
                "totalAdmins" => $totalAdmins,
                "totalEmployees" => $totalEmployees,
                "completedOrientation" => $completedOrientation,
                "pendingExtensions" => $pendingExtensions
            ]
        ]);
    }
}
