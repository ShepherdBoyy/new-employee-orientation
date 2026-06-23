<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\Company;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Password;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class CompanyAdminController extends Controller
{
    public function index(): Response
    {
        $admins = User::with("company")
            ->where('role', "company_admin")
            ->latest()
            ->get();
        
        $companies = Company::where("status", "active")
            ->get(["id", "name"]);  

        return Inertia::render("SuperAdmin/CompanyAdmins/Index", [
            "admins" => $admins,
            "companies" => $companies
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            "company_id" => ["required", "exists:companies,id"],
            "name" => ["required", "string", "max:255"],
            "email" => ["required", "email", "unique:users,email"]
        ]);

        User::create([
            ...$validated,
            "password" => "password",
            "role" => "company_admin",
            "status" => "active"
        ]);

        return back()->with("success", "Company admin created successfully");
    }

    public function update(Request $request, User $user): RedirectResponse
    {
        $validated = $request->validate([
            "company_id" => ["required", "exists:companies,id"],
            "name" => ["required", "string", "max:255"],
            "email" => ["required", "email", Rule::unique("users")->ignore($user->id)]
        ]);
        
        $user->update($validated);
        
        return back()->with("success", "Company admin updated successfully");
    }

    public function toggleStatus(User $user): RedirectResponse
    {
        $newStatus = $user->status === "active" ? "locked" : "active";
        $label = $newStatus === "active" ? "activated" : "deactivated";

        $user->update(["status" => $newStatus]);

        return back()->with("success", "Company admin {$label} successfully");
    }

    public function destroy(User $user): RedirectResponse
    {
        $user->delete();

        return back()->with("success", "Company admin deleted successfully");
    }

    public function resetPassword(User $user): RedirectResponse
    {
        Password::sendResetLink(["email" => $user->email]);

        return back()->with("success", "Password reset link sent successfully");
    }
}