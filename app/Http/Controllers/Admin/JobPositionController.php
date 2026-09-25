<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Company;
use App\Models\JobPosition;
use App\Models\Document;
use App\Support\AuditLogger;
use DB;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Storage;

class JobPositionController extends Controller
{

    public function index(Request $request)
    {
        $jobs = JobPosition::with('companies')
            ->when($request->filled('search'), function ($query) use ($request) {
                $search = $request->input('search');

                $query->where("name", "like", "%" . $search . "%");
            })
            ->when($request->filled("filter") && $request->input("filter") !== "all", function ($query) use ($request) {
                $query->where("employee_type", $request->input("filter"));
            })
            ->orderBy("name")
            ->paginate(11)
            ->withQueryString();

        return Inertia::render("Admin/JobPositions/AllJobs/Index", [
            'jobs' => $jobs,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            "name" => ["required", "string", "max:255", 'unique:job_positions'],
            'employee_type' => ['required']
        ]);

        $jobPosition = JobPosition::create($validated);

        AuditLogger::record(
            "created",
            "Created job position \"{$jobPosition->name}\"",
            $jobPosition,
            [],
            $jobPosition->only(["name", "employee_type"])
        );

        return back()->with("success", "Job position created successfully");
    }


    public function update(Request $request, JobPosition $jobPosition): RedirectResponse
    {
        $validated = $request->validate([
            "name" => ["required", "string", "max:255"],
            'employee_type' => ['required']
        ]);

        $oldValues = $jobPosition->only(["name", "employee_type"]);

        $jobPosition->update([
            "name" => $validated["name"],
            'employee_type' => $validated["employee_type"]
        ]);

        AuditLogger::record(
            "updated",
            "Updated job position \"{$jobPosition->name}\"",
            $jobPosition,
            $oldValues,
            $jobPosition->only(["name", "employee_type"])
        );

        return back()->with("success", "Job position updated successfully");
    }

    public function destroy(JobPosition $jobPosition): RedirectResponse
    {
        AuditLogger::record(
            "deleted",
            "Deleted job position \"{$jobPosition->name}\"",
            $jobPosition
        );

        $jobPosition->delete();

        return back()->with("success", "Job position deleted successfully");
    }

    public function destroyMultipleJobs(Request $request)
    {
        $positions = JobPosition::whereIn("id", $request->ids)->get();

        foreach ($positions as $position) {
            AuditLogger::record(
                "deleted",
                "Deleted job position \"{$position->name}\" (bulk delete)",
                $position
            );
        }

        JobPosition::destroy($request->ids);

        return back()->with("success", "Multiple job positions deleted successfully");
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

    public function jobAssignments(Request $request): Response
    {
        $companies = Company::with(['jobs'])->get();

        $documents = Document::all();

        $filteredCompanies = $companies->map(function ($company) use ($documents) {
            $company->jobs->transform(function ($job) use ($company, $documents) {
                $pdf = $documents->firstWhere(function ($item) use ($company, $job) {
                    return $item->company_id === $company->id
                        && $item->job_position_id === $job->id;
                });

                $job->document = $pdf ? [
                    'id' => $pdf->id,
                    'file_path' => $pdf->file_path,
                    'orig_name' => $pdf->orig_name,
                ] : null;

                return $job;
            });

            return $company;
        });

        $jobs = JobPosition::get();

        return Inertia::render("Admin/JobPositions/Assignment/Index", [
            "companies" => $filteredCompanies,
            "jobs" => $jobs,
            "document" => $documents
        ]);
    }

    public function assignJobs(Request $request)
    {
        $request->validate([
            'company_ids' => 'required|array',
            'job_ids' => 'present|array',
        ]);

        $companies = Company::whereIn('id', $request->company_ids)->get();
        $jobNames = JobPosition::whereIn("id", $request->job_ids)->pluck("name")->implode(", ");

        foreach ($companies as $company) {
            $company->jobs()->syncWithoutDetaching($request->job_ids);

            AuditLogger::record(
                "updated",
                "Assigned jobs position(s) [{$jobNames}] to company \"{$company->name}\"",
                $company
            );
        }

        return back()->with("success", "Job assigned successfully");
    }

    public function deleteAssignedJob($company_id, $job_id)
    {
        $company = Company::find($company_id);
        $jobPosition = JobPosition::find($job_id);

        DB::table('company_job_position')
            ->where('company_id', $company_id)
            ->where('job_position_id', $job_id)
            ->delete();

        AuditLogger::record(
            "updated",
            "Unlinked job position \"{$jobPosition?->name}\" from company \"{$company?->name}\"",
            $company
        );

        return back()->with("success", "Job position unlinked successfully");
    }

    public function uploadJd(Request $request)
    {
        $request->validate([
            'pdf_file' => 'required|file|mimes:pdf|max:10240'
        ]);

        $document = null;

        if ($request->hasFile('pdf_file')) {
            $file = $request->file('pdf_file');

            $path = Storage::disk('public')->putFile('', $file);

            $document = Document::updateOrCreate(
                [
                    'company_id' => $request->company_id,
                    'job_position_id' => $request->job_position_id,
                ],
                [
                    'file_path' => $path,
                    'orig_name' => $file->getClientOriginalName(),
                ]

            );

            if ($document->wasRecentlyCreated) {
                AuditLogger::record(
                    "created",
                    "Uploaded Job Description \"{$document->orig_name}\" for company \"{$document->company?->name}\" / job position \"{$document->jobPosition?->name}\"",
                    $document
                );

                return back()->with([
                    'success' => 'Document created successfully!',
                    'document' => $document
                ]);
            } else {
                AuditLogger::record(
                    "updated",
                    "Replaced Job Description with \"{$document->orig_name}\" for company \"{$document->company?->name}\" / job position \"{$document->jobPosition?->name}\"",
                    $document
                );

                return back()->with([
                    'success' => 'Document updated successfully!',
                    'document' => $document
                ]);
            }
        }
    }

}
