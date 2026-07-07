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
    public function index(): Response
    {
        $positions = JobPosition::orderBy("name")
            ->get();

        $companies = Company::where("status", "active")
            ->with("jobs")
            ->get(["id", "name"]);
        
        return Inertia::render("Admin/JobPositions/Index", [
            "companies" => $companies,
            "positions" => $positions
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $duplicateCheck = false;
        $validated = $request->validate([
            "company_ids" => "required",
            "name" => ["required", "string", "max:255"]
        ]);

        // 1. Pull the array of company IDs out of the validated data
        $companyIds = $validated['company_ids'];

        // 2. Loop through each company ID and create a separate database row
        foreach ($companyIds as $id) {
            if (DB::table('job_positions')->where('company_id', $id)->where('name', $validated['name'])->doesntExist()) {
                JobPosition::create([
                    'name'       => $validated['name'],
                    'company_id' => $id, // Assigns the single ID for this row
                ]);
            } else {
                $duplicateCheck = true;
                break;
            }
        }

        if($duplicateCheck){
            return back()->withErrors("Job position failed successfully");
        } else {
            return back()->with("success", "Job position created successfully");
        }

        
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
}
