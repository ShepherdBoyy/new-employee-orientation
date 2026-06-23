<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ExtensionRequest;
use App\Models\Slide;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Password;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class EmployeeController extends Controller
{
    public function index(): Response
    {
        $companyId = Auth::user()->company_id;

        $employees = User::where("company_id", $companyId)
            ->where("role", "employee")
            ->withCount("acknowledgements")
            ->with("extensionRequests")
            ->latest()
            ->get();
        
        $totalSlides = Slide::where("company_id", $companyId)
            ->count();
        
        $slides = Slide::where("company_id", $companyId)        
            ->orderBy("order")
            ->get();

        return Inertia::render("Admin/Employees/Index", [
            "employees" => $employees,
            "totalSlides" => $totalSlides,
            "slides" => $slides
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            "name" => ["required", "string", "max:255"],
            "email" => ["required", "email", "unique:users,email"]
        ]);

        User::create([
            ...$validated,
            "company_id" => Auth::user()->company_id,
            "password" => 'password',
            "role" => "employee",
            "status" => "active",
            "expires_at" => now()->addHours(24)
        ]);

        return back()->with("success", "Employee account created successfully");
    }

    public function update(Request $request, User $employee): RedirectResponse
    {
        abort_if($employee->company_id !== Auth::user()->company_id, 403);

        $validated = $request->validate([
            "name" => ["required", "string", "max:255"],
            "email" => ["required", "email", Rule::unique("users")->ignore($employee->id)]
        ]); 

        $employee->update($validated);

        return back()->with("success", "Employee account updated successfully");
    }

    public function toggleStatus(User $employee): RedirectResponse
    {
        abort_if($employee->company_id !== Auth::user()->company_id, 403);

        $newStatus = $employee->status === "active" ? "locked" : "active";
        $label = $newStatus === "active" ? "activated" : "deactivated";

        $employee->update(["status" => $newStatus]);

        return back()->with("success", "Employee {$label} successfully");
    }

    public function destroy(User $employee): RedirectResponse
    {
        abort_if($employee->company_id !== Auth::user()->company_id, 403);

        $employee->delete();

        return back()->with("success", "Employee deleted successfully");
    }

    public function resetPassword(User $employee): RedirectResponse
    {
        abort_if($employee->company_id !== Auth::user()->company_id, 403);

        Password::sendResetLink(["email" => $employee->email]);

        return back()->with("success", "Password reset link sent successfully");
    }

    public function preview(): Response
    {
        $slides = Slide::where("company_id", Auth::user()->company_id)
            ->orderBy("order")
            ->get();

        return Inertia::render("Admin/Slides/Preview", [
            "slides" => $slides
        ]);
    }

    public function extensionRequests(): Response
    {
        $requests = ExtensionRequest::with("user")
            ->whereHas("user", function ($query) {
                $query->where("company_id", Auth::user()->company_id);
            })
            ->where("status", "pending")
            ->latest("requested_at")
            ->get();
        
        return Inertia::render("Admin/ExtensionRequests/Index", [
            "requests" => $requests
        ]);
    }

    public function approveExtension(ExtensionRequest $extensionRequest): RedirectResponse
    {
        abort_if($extensionRequest->user->company_id !== Auth::user()->company_id, 403);

        $extensionRequest->approve();

        return back()->with("success", "Extension approved. Employee account reactivated");
    }

    public function denyExtension(ExtensionRequest $extensionRequest): RedirectResponse
    {
        abort_if($extensionRequest->user->company_id !== Auth::user()->company_id, 403);

        $extensionRequest->deny();

        return back()->with("success", "Extension request denied");
    }
}