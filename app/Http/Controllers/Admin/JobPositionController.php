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

class JobPositionController extends Controller
{
    public function index(): Response
    {
        $companies = Company::where("status", "active")
            ->with(["employeeTypes", "jobPositions"])
            ->get();
        
        return Inertia::render("Admin/JobPositions/Index", [
            "companies" => $companies
        ]);
    }

    public function storeEmployeeType(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            "company_id" => ["required", "exists:companies,id"],
            "employee_type" => ["required", Rule::in(["office", "field"])]
        ]);

        $alreadyExists = CompanyEmployeeType::where("company_id", $validated["company_id"])
            ->where("employee_type", $validated["employee_type"])
            ->exists();
        
        if ($alreadyExists) {
            return back()->withErrors([
                "employee_type" => "This employee type already exists for this company"
            ]);
        }

        CompanyEmployeeType::create($validated);

        return back()->with("success", "Employee type added successfully");
    }

    public function destroyEmployeeType(CompanyEmployeeType $employeeType): RedirectResponse
    {
        $employeeType->delete();

        return back()->with("success", "Employee type removed successfully");
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            "company_id" => ["required", "exists:companies,id"],
            "employee_type" => [
                "required",
                Rule::in(["office", "field"]),
                function ($attribute, $value, $fail) use ($request) {
                    $typeExists = CompanyEmployeeType::where("company_id", $request->company_id)
                        ->where("employee_type", $value)
                        ->exists();
                    
                    if (!$typeExists) {
                        $fail("This employee type is not configured for the selected company");
                    }
                }
            ],
            "name" => [
                "required",
                "string",
                "max:255",
                Rule::unique("job_positions")->where(function ($query) use ($request) {
                    return $query->where("company_id", $request->company_id)
                                 ->where("employee_type", $request->employee_type);
                })
            ]
        ]);

        JobPosition::create($validated);

        return back()->with("success", "Job position created successfully");
    }

    public function update(Request $request, JobPosition $jobPosition): RedirectResponse
    {
        $validated = $request->validate([
            "name" => [
                "required",
                "string",
                "max:255",
                Rule::unique("job_positions")
                    ->where(function ($query) use ($jobPosition) {
                        return $query->where("company_id", $jobPosition->company_id)
                                     ->where("employee_type", $jobPosition->employee_type);
                    })->ignore($jobPosition->id)
            ]
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
            "employee_type" => ["required", Rule::in(["office", "field"])]
        ]);

        $positions = JobPosition::forCompany($validated["company_id"])
            ->forType($validated["employee_type"])
            ->orderBy("name")
            ->get(["id", "name"]);
        
        $types = CompanyEmployeeType::where("company_id", $validated["company_id"])
            ->get(['employee_type']);
        
        return response()->json([
            "positions" => $positions,
            "types" => $types
        ]);
    }
}
