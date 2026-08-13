<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Company;
use App\Models\Folder;
use App\Models\JobPosition;
use App\Models\Document;
use DB;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Storage;

class JobPositionController extends Controller
{

    public function index()
    {
        $jobs = JobPosition::with('companies')->paginate(12);
        return Inertia::render("Admin/JobPositions/AllJobs/Index")->with(['jobs' => $jobs]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            "name" => ["required", "string", "max:255", 'unique:job_positions'],
            'type' => ['required']
        ]);

        $jobPosition = JobPosition::create($validated);
        
        return back()->with("success", "Job position created successfully");
    }
    

    public function update(Request $request, JobPosition $jobPosition): RedirectResponse
    {
        $validated = $request->validate([
            "name" => ["required", "string", "max:255"],
            'type' => ['required']
        ]);

        $jobPosition->update(["name" => $validated["name"], 'type' => $validated["type"]]);

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
                // Find matching PDF for this exact Company + Job Position pair
                $pdf = $documents->firstWhere(function ($item) use ($company, $job) {
                    return $item->company_id === $company->id 
                        && $item->job_position_id === $job->id;
                });

                // Attach jd_pdf object directly to the job object
                $job->document = $pdf ? [
                    'id'        => $pdf->id,
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

        foreach ($companies as $company) {
            $company->jobs()->syncWithoutDetaching($request->job_ids);
                
            foreach ($request->job_ids as $jobId) {
                Folder::ensureJobSpecificFolder($company->id, $jobId);
            }
        }

        return back()->with("success", "Job assigned successfully");
    }

    public function deleteAssignedJob($company_id, $job_id)
    {
        DB::table('company_job_position')
        ->where('company_id', $company_id)
        ->where('job_position_id', $job_id)
        ->delete();

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

            // 1. Upload to the 'public' disk inside a 'pdfs' folder
            $path = Storage::disk('public')->putFile('', $file);

            // 2. Save records to the database
            $document = Document::updateOrCreate(
                // 1. Search Criteria (What makes it unique?)
                [
                    'company_id' => $request->company_id,
                    'job_position_id' => $request->job_position_id,
                ],
                // 2. Data to insert or update with
                [
                    'file_path' => $path,
                    'orig_name' => $file->getClientOriginalName(),
                ]

            );

            // return back()->with('success', 'PDF uploaded and saved to database successfully!');
            // Check if it was newly created or updated
            if ($document->wasRecentlyCreated) {
                // It was a brand new record
                return back()->with([
                    'success' => 'Document created successfully!',
                    'document' => $document
                ]);
            } else {
                // It already existed and was updated
                return back()->with([
                    'success' => 'Document updated successfully!',
                    'document' => $document
                ]);
            }
        }
    }

}
