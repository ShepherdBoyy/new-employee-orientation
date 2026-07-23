<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Company;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Password;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;
use Storage;

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
            ->with("company", "jobPosition")
            ->latest()
            ->get()
            ->map(function (User $employee) {
                $totalFolders = $employee->company
                    ? $employee->company->foldersForEmployee($employee)->count()
                    : 0;
                $completedFolders = $employee->folderCompletions()->count();
                $status = match (true) {
                    $employee->hasAcknowledgedOrientation() => "acknowledged",
                    $completedFolders > 0 => "in_progress",
                    default => "not_started"
                };

                return [
                    "id" => $employee->id,
                    "name" => $employee->name,
                    "email" => $employee->email,
                    "expires_at" => $employee->expires_at,
                    "company" => $employee->company,
                    "job_position" => $employee->jobPosition,
                    "total_folders" => $totalFolders,
                    "completed_folders" => $completedFolders,
                    "status" => $status
                ];
            });
        
        $companies = Company::with("jobs:id,name")
            ->get(["id", "name"]);

        return Inertia::render("Admin/Users/Employees", [
            "employees" => $employees,
            "companies" => $companies,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            "name" => ["required", "string", "max:255"],
            "email" => ["required", "email", "unique:users,email"],
            "role" => ["required", Rule::in(["admin", "employee"])],
            "company_id" => ["nullable", "exists:companies,id", Rule::requiredIf($request->role === "employee")],
            "job_position_id" => ["nullable", "exists:job_positions,id"],
        ]);

        User::create([
            "name" => $validated["name"],
            "email" => $validated["email"],
            "role" => $validated["role"],
            "company_id" => $validated["role"] === "admin" ? null : $validated["company_id"],
            "job_position_id" => $validated['role'] === "admin" ? null : ($validated["job_position_id"] ?? null),
            "password" => User::generateDefaultPassword($validated["name"]),
            "expires_at" => $validated["role"] === "employee" ? now()->addDays(2) : null
        ]);

        return back()->with("success", "User created successfully");
    }

    public function update(Request $request, User $user): RedirectResponse
    {
        $validated = $request->validate([
            "name" => ["required", "string", "max:255"],
            "email" => ["required", "email", Rule::unique("users")->ignore($user->id)],
            "company_id" => [
                "nullable",
                "exists:companies,id",
                Rule::requiredIf($user->role === "employee")
            ],
            "job_position_id" => ["nullable", "exists:job_positions,id"]
        ]); 

        $user->update([
            "name" => $validated["name"],
            "email" => $validated["email"],
            "company_id" => $user->isAdmin() ? null : $validated["company_id"],
            "job_position_id" => $user->isAdmin() ? null : ($validated["job_position_id"] ?? null)
        ]);

        return back()->with("success", "User updated successfully");
    }

    public function destroy(User $user): RedirectResponse
    {
        $user->delete();

        return back()->with("success", "User deleted successfully");
    }

    public function progress(User $user): JsonResponse
    {
        abort_unless($user->isEmployee(), 404);

        $folders = $user->company
            ? $user->company->foldersForEmployee($user)
            : collect();
        
        $completions = $user->folderCompletions()
            ->pluck("completed_at", "folder_id");
        
        $folderProgress = $folders->map(function ($folder) use ($completions) {
            return [
                "id" => $folder->id,
                "name" => $folder->name,
                "slide_count" => $folder->slideCount(),
                "completed" => $completions->has($folder->id),
                "completed_at" => $completions->get($folder->id)
            ];
        });

        $acknowledgement = $user->orientationAcknowledgement;

        return response()->json([
            "folders" => $folderProgress,
            "acknowledgement" => $acknowledgement ? [
                "full_name_confirmation" => $acknowledgement->full_name_confirmation,
                "acknowledged_at" => $acknowledgement->acknowledged_at->format("F j, Y g:i A"),
                "ip_address" => $acknowledgement->ip_address
            ] : null
        ]);
    }

    public function viewSignature(User $user): JsonResponse
    {
        abort_unless($user->isEmployee(), 404);

        $acknowledgement = $user->orientationAcknowledgement;

        abort_if(!$acknowledgement, 404);

        return response()->json([
            "url" => $acknowledgement->signatureUrl()
        ]);
    }

    public function streamSignature(User $user): \Symfony\Component\HttpFoundation\Response
    {
        abort_unless($user->isEmployee(), 404);

        $acknowledgement = $user->orientationAcknowledgement;

        abort_if(!$acknowledgement, 404);

        return Storage::disk("private")->response($acknowledgement->getRawOriginal("signature_path"));
    }

    public function viewPhoto(User $user): JsonResponse
    {
        abort_unless($user->isEmployee(), 404);

        $acknowledgement = $user->orientationAcknowledgement;

        abort_if(!$acknowledgement, 404);

        return response()->json([
            "url" => $acknowledgement->photoUrl()
        ]);
    }
    
    public function streamPhoto(User $user): \Symfony\Component\HttpFoundation\Response
    {
        abort_unless($user->isEmployee(), 404);

        $acknowledgement = $user->orientationAcknowledgement;

        abort_if(!$acknowledgement, 404);

        return Storage::disk("private")->response($acknowledgement->getRawOriginal("photo_path"));
    }
}