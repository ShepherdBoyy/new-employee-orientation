<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Company;
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

        return Inertia::render("Admin/Dashboard", [
            "stats" => [
                "totalCompanies" => $totalCompanies,
                "totalAdmins" => $totalAdmins,
                "totalEmployees" => $totalEmployees,
            ]
        ]);
    }
}
