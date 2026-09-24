<?php

namespace App\Http\Controllers\Admin;

use App\Exports\EmployeesExport;
use App\Http\Controllers\Controller;
use App\Mail\EmployeeWelcomeMail;
use App\Models\Company;
use App\Models\User;
use Auth;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;
use Log;
use Maatwebsite\Excel\Facades\Excel;
use Mail;

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

    public function index(Request $request): Response
    {
        $baseQuery = User::query()
            ->where("role", "employee")
            ->when($request->filled('search'), function ($query) use ($request) {
                $search = $request->input('search');
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', '%' . $search . '%')
                        ->orWhere('email', 'like', '%' . $search . '%');
                });
            })
            ->when($request->filled('company_id'), function ($query) use ($request) {
                $query->where('company_id', $request->input('company_id'));
            });

        $stats = [
            "total" => (clone $baseQuery)->count(),
            "acknowledged" => (clone $baseQuery)->whereHas("orientationAcknowledgement")->count(),
            "in_progress" => (clone $baseQuery)
                ->whereDoesntHave("orientationAcknowledgement")
                ->whereHas("folderCompletions")
                ->count(),
            "not_started" => (clone $baseQuery)
                ->whereDoesntHave("orientationAcknowledgement")
                ->whereDoesntHave("folderCompletions")
                ->count()
        ];

        $employees = (clone $baseQuery)
            ->when($request->filled("status"), function ($query) use ($request) {
                match ($request->input("status")) {
                    "acknowledged" => $query->whereHas("orientationAcknowledgement"),
                    "in_progress" => $query->whereDoesntHave("orientationAcknowledgement")->whereHas("folderCompletions"),
                    "not_progress" => $query->whereDoesntHave("orientationAcknowledgement")->whereDoesntHave("folderCompletions"),
                    default => $query
                };
            })
            ->with("company", "jobPosition")
            ->latest()
            ->paginate(6)
            ->withQueryString()
            ->through(function (User $employee) {
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

        $companies = Company::with(["jobs" => function ($query) {
            $query->select("job_positions.id", "job_positions.name")
                ->whereHas("document", function ($q) {
                    $q->whereColumn("documents.company_id", "company_job_position.company_id");
                });
        }])->get(["id", "name"]);

        return Inertia::render("Admin/Users/Employees", [
            "employees" => $employees,
            "companies" => $companies,
            "stats" => $stats,
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

        $plainPassword = User::generateDefaultPassword($validated["name"]);

        $user = User::create([
            "name" => $validated["name"],
            "email" => $validated["email"],
            "role" => $validated["role"],
            "company_id" => $validated["role"] === "admin" ? null : $validated["company_id"],
            "job_position_id" => $validated['role'] === "admin" ? null : ($validated["job_position_id"] ?? null),
            "password" => $plainPassword,
            "expires_at" => $validated["role"] === "employee" ? now()->addDays(2) : null
        ]);

        if ($user->isEmployee()) {
            Mail::to($user->email)->send(new EmployeeWelcomeMail($user, $plainPassword));
        }

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
                "acknowledged_at" => $acknowledgement->acknowledged_at->format("F j, Y g:i A"),
            ] : null
        ]);
    }

    public function exportAcknowledgementPdf(User $user)
    {
        abort_unless($user->isEmployee(), 404);

        $acknowledgement = $user->orientationAcknowledgement;

        abort_if(!$acknowledgement, 404, "This employee has not submitted their acknowledgement yet");

        Log::channel("sensitive_access")->info("Acknowledgement PDF exported", [
            "admin_id" => auth()->id(),
            "admin_email" => auth()->user()->email,
            "employee_id" => $user->id,
            "timestamp" => now()->toDateTimeString()
        ]);

        $folders = $user->company->foldersForEmployee($user)->load("keyTopics.slides");

        $modules = $folders
            ->map(function ($folder) {
                $keyTopics = $folder->keyTopics
                    ->filter(fn($topic) => $topic->slides->isNotEmpty())
                    ->sortBy("order")
                    ->pluck("label")
                    ->values()
                    ->toArray();
                
                return [
                    "name" => $folder->name,
                    "key_topics" => $keyTopics
                ];
            })
            ->filter(fn($module) => !empty($module["key_topics"]))
            ->values();

        $signaturePath = Storage::disk("private")->path($acknowledgement->getRawOriginal("signature_path"));
        $photoPath = Storage::disk("private")->path($acknowledgement->getRawOriginal("photo_path"));

        $hrAdmin = Auth::user();
        $hrSignaturePath = $hrAdmin->hasSignature()
            ? Storage::disk("private")->path($hrAdmin->signature_path)
            : null;

        $pdf = Pdf::loadView("pdf.acknowledgement-certificate", [
            "employeeName" => $user->name,
            "jobPosition" => $user->jobPosition?->name,
            "companyName" => $user->company?->name,
            "acknowledgedAt" => $acknowledgement->acknowledged_at->format("F j, Y"),
            "modules" => $modules,
            "fullNameConfirmation" => $acknowledgement->full_name_confirmation,
            "signaturePath" => $signaturePath,
            "photoPath" => $photoPath,
            "hrAdminName" => $hrAdmin->name,
            "hrSignaturePath" => $hrSignaturePath,
            "generatedAt" => now()->format("F j, Y \\a\\t g:i A"),
            "hasJobDescription" => $user->jobDescriptionPath() !== null,
            "jdViewedAt" => $user->jd_viewed_at?->format("F j, Y g:i A"),
        ]);

        $filename = Str::slug($user->name) . "-orientation-acknowledgement.pdf";

        return $pdf->stream($filename);
    }

    public function exportEmployees()
    {
        $filename = "employees-" . now()->format("Y-m-d") . ".xlsx";

        return Excel::download(new EmployeesExport, $filename);
    }
}