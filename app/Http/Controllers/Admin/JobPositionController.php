<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Company;
use App\Models\JobPosition;
use DB;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class JobPositionController extends Controller
{

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

    public function destroyMultipleJobs(Request $request) 
    {
        JobPosition::destroy($request->ids);
    }

    public function getByCompany(Request $request): JsonResponse
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

    public function jobAssignments(): Response
    {
        $positions = JobPosition::orderBy("name")
            ->get();

        $companies = Company::where("status", "active")
            ->with('jobs')
            ->get(["id", "name", "logo_path"]);

        $jobs = JobPosition::all();
        return Inertia::render("Admin/JobPositions/Assignment/Index", [
            "companies" => $companies,
            "positions" => $positions,
            "jobs" => $jobs
        ]);
    }

    public function assignJobs(Request $request)
    {
        $request->validate([
            'company_ids' => 'required|array',
            'company_ids.*' => 'exists:companies,id',
            'job_ids' => 'present|array',
            'job_ids.*' => 'exists:job_positions,id',
        ]);

        // 1. Fetch the collection of company models
        $companies = Company::whereIn('id', $request->company_ids)->get();

        // 2. Loop through each company and sync the jobs
        foreach ($companies as $company) {
            // This inserts new relationships and ignores existing ones
            $company->jobs()->syncWithoutDetaching($request->job_ids);
        }
    }

    public function deleteAssignedJob($company_id, $job_id)
    {
        DB::table('company_job_position')
        ->where('company_id', $company_id)
        ->where('job_position_id', $job_id)
        ->delete();
    }

}
