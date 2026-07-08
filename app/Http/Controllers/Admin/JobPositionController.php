<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Company;
use App\Models\CompanyEmployeeType;
use App\Models\JobPosition;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\DB;
class JobPositionController extends Controller
{
    public function jobAssignments(): Response
    {
        $positions = JobPosition::orderBy("name")
            ->get();

        $companies = Company::where("status", "active")
            ->with('jobs')
            ->get(["id", "name", "logo_path"]);
        
        return Inertia::render("Admin/JobPositions/Assignment/Index", [
            "companies" => $companies,
            "positions" => $positions
        ]);
    }

    public function index()
    {
        $jobs = JobPosition::with('companies')->get();
        return Inertia::render("Admin/JobPositions/AllJobs/Index")->with(['jobs' => $jobs]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            "name" => ["required", "string", "max:255", 'unique:job_positions']
        ]);

        $jobPosition = JobPosition::create($validated);
        
        return back()->with("success", "Job position created successfully");
    }

    public function update(Request $request, JobPosition $jobPosition): RedirectResponse
    {
        $validated = $request->validate([
            "name" => ["required", "string", "max:255"]
        ]);

        $jobPosition->update(["name" => $validated["name"]]);

        return back()->with("success", "Job position updated successfully");
    }

    public function destroy(JobPosition $jobPosition): RedirectResponse
    {
        $jobPosition->delete();

        return back()->with("success", "Job position deleted successfully");
    }

    public function getByCompanyAndType(Request $request): JsonResponse
    {
        $validated = $request->validate([
            "company_id" => ["required", "exists:companies,id"],
        ]);

        $positions = JobPosition::forCompany($validated["company_id"])
            ->orderBy("name")
            ->get(["id", "name"]);
        
        return response()->json([
            "positions" => $positions,
        ]);
    }

    public function allJobsIndex(): Response
    {
        return Inertia::render("Admin/JobPositions/AllJobs/Index");
    }
}
