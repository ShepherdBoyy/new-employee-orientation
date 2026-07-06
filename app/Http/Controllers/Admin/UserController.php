<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Company;
use App\Models\ExtensionRequest;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Password;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    public function admins(): Response
    {
        $admins = User::where("role", "admin")
            ->latest()
            ->get();
        
        return Inertia::render("Admin/Users/Admins", [
            "admins" => $admins,
        ]);
    }

    public function index(): Response
    {
        $employees = User::where("role", "employee")
            ->with("company")
            ->latest()
            ->get();
        
        $companies = Company::where("status", "active")        
            ->get(["id", "name"]);

        return Inertia::render("Admin/Users/Employees", [
            "employees" => $employees,
            "companies" => $companies
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            "name" => ["required", "string", "max:255"],
            "email" => ["required", "email", "unique:users,email"],
            "role" => ["required", Rule::in(["admin", "employee"])],
            "company_id" => [
                Rule::requiredIf($request->role === "employee"),
                "nullable",
                "exists:companies,id"
            ],
            "job_title" => 'required', // No column yet...
            "field_type" => 'required', // No column yet...
        ]);

        dd($request->all());

        // User::create([
        //     "name" => $validated["name"],
        //     "email" => $validated["email"],
        //     "role" => $validated["role"],
        //     "company_id" => $validated["role"] === "admin" ? null : $validated["company_id"],
        //     "password" => "password",
        //     "status" => "active",
        //     "expires_at" => $validated["role"] === "employee" ? now()->addHours(24) : null
        // ]);

        // return back()->with("success", "User created successfully");
    }

    public function update(Request $request, User $user): RedirectResponse
    {
        $validated = $request->validate([
            "name" => ["required", "string", "max:255"],
            "email" => ["required", "email", Rule::unique("users")->ignore($user->id)],
            "company_id" => [
                Rule::requiredIf($user->role === "employee"),
                "nullable",
                "exists:companies,id"
            ]
        ]); 

        $user->update([
            "name" => $validated["name"],
            "email" => $validated["email"],
            "company_id" => $user->isAdmin() ? null : $validated["company_id"]
        ]);

        return back()->with("success", "User updated successfully");
    }

    public function toggleStatus(User $user): RedirectResponse
    {
        $newStatus = $user->status === "active" ? "locked" : "active";
        $label = $newStatus === "active" ? "activated" : "deactivated";

        $user->update(["status" => $newStatus]);

        return back()->with("success", "User {$label} successfully");
    }

    public function destroy(User $user): RedirectResponse
    {
        $user->delete();

        return back()->with("success", "User deleted successfully");
    }

    public function resetPassword(User $user): RedirectResponse
    {
        Password::sendResetLink(["email" => $user->email]);

        return back()->with("success", "Password reset link sent successfully");
    }
}