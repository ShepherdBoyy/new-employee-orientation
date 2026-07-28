<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Company;
use App\Models\Folder;
use App\Models\JobPosition;
use App\Models\Slide;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Storage;

class FolderController extends Controller
{
    public function companyIndex(Company $company): Response
    {
        $companyWideFolders = Folder::forCompany($company->id)
            ->companyWide()
            ->ordered()
            ->withCount("slides")
            ->get();

        $company->load("jobs:id,name,slug");

        $jobSpecificFolders = Folder::forCompany($company->id)
            ->whereNotNull("job_position_id")
            ->get(["id", "job_position_id", "order", "name", "key_topics"]);
        
        $firstJobSpecific = $jobSpecificFolders->first();
        
        $jobSpecificSummary = $company->jobs->isNotEmpty() ? [
            "total_positions" => $company->jobs->count(),
            "order" => $firstJobSpecific?->order ?? ($companyWideFolders->max("order") + 1 ?? 1),
            "name" => $firstJobSpecific?->name ?? "Job-Specific Training",
            "key_topics" => $firstJobSpecific?->key_topics ?? []
        ] : null;

        return Inertia::render("Admin/Folders/Company", [
            "company" => [
                "id" => $company->id,
                "name" => $company->name,
                "slug" => $company->slug,
                "jobs" => $company->jobs
            ],
            "companyWideFolders" => $companyWideFolders,
            "jobSpecificSummary" => $jobSpecificSummary
        ]); 
    }

    public function jobPositionPicker(Company $company): Response
    {
        $company->load("jobs:id,name,slug");

        $folders = Folder::forCompany($company->id)
            ->whereNotNull("job_position_id")
            ->get(["id", "job_position_id", "slug"]);

        $positions = $company->jobs->map(function (JobPosition $position) use ($folders) {
            $folder = $folders->firstWhere("job_position_id", $position->id);

            return [
                "id" => $position->id,
                "name" => $position->name,
                "has_folder" => $folder !== null,
                "folder_slug" => $folder?->slug
            ]; 
        });

        return Inertia::render("Admin/Folders/JobPositionPicker", [
            "company" => $company,
            "positions" => $positions
        ]);
    }

    public function resolveJobSpecificFolder(Company $company, JobPosition $jobPosition): RedirectResponse
    {
        $folder = Folder::ensureJobSpecificFolder($company->id, $jobPosition->id);

        return redirect()->route("admin.slides.index", $folder->slug);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            "name" => ["required", "string", "max:255"],
            "company_id" => ["required", "exists:companies,id"],
            "key_topics" => ["nullable", "array"],
            "key_topics.*" => ["required", "string", "max:255"]
        ]);

        $lastOrder = Folder::forCompany($validated["company_id"])
            ->companyWide()
            ->max("order") ?? 0;

        Folder::create([
            "company_id" => $validated["company_id"],
            "name" => $validated["name"],
            "key_topics" => array_values(array_filter($validated["key_topics"] ?? [])),
            "order" => $lastOrder + 1
        ]);

        return back()->with("success", "Folder created successfully");
    }

    public function update(Request $request, Folder $folder): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ["required", "string", "max:255"],
            "key_topics" => ["nullable", "array"],
            "key_topics.*" => ["required", "string", "max:255"]
        ]);

        $folder->update([
            "name" => $validated["name"],
            "key_topics" => array_values(array_filter($validated["key_topics"] ?? [])),
        ]);

        return back()->with("success", "Folder updated successfully");
    }

    public function updateJobSpecific(Request $request, Company $company): RedirectResponse
    {
        $validated = $request->validate([
            "name" => ["required", "string", "max:255"],
            "key_topics" => ["present", "array"],
            "key_topics.*" => ["nullable", "string", "max:255"]
        ]);

        Folder::where("company_id", $company->id)
            ->whereNotNull("job_position_id")
            ->update([
                "name" => $validated["name"],
                "key_topics" => json_encode(array_values(array_filter($validated["key_topics"] ?? [])))
            ]);

        return back()->with("success", "Job-specific training name updated successfully");
    }

    public function reorder(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            "company_id" => ["required", "exists:companies,id"],
            "items" => ["required", "array"],
            "items.*.type" => ["required", "in:folder,job-specific"],
            "items.*.id" => ["nullable", "integer"],
            "items.*.order" => ["required", "integer", "min:1"]
        ]);
        
        foreach ($validated["items"] as $item) {
            if ($item["type"] === "job-specific") {
                Folder::where("company_id", $validated["company_id"])
                    ->whereNotNull("job_position_id")
                    ->update(["order" => $item["order"]]);
            } else {
                Folder::where("id", $item["id"])
                    ->where("company_id", $validated["company_id"])
                    ->update(["order" => $item["order"]]);
            }
        }

        return back()->with("success", "Folders reordered successfully");
    }

    public function destroy(Folder $folder): RedirectResponse
    {
        $folder->slides->each(function (Slide $slide) {
            Storage::disk(config("filesystems.default"))
                ->delete($slide->file_path);
        });

        $folder->delete();
    
        return back()->with("success", "Folder deleted successfully");
    }

    public function previewFolderList(Request $request): Response
    {
        $request->validate([
            'company_id'      => ['required', 'exists:companies,id'],
            'job_position_id' => ['nullable', 'exists:job_positions,id'],
        ]);

        $company = Company::findOrFail($request->company_id);

        $simulatedUser = new User([
            'company_id'      => $request->company_id,
            'job_position_id' => $request->job_position_id,
        ]);

        $folders = $company->foldersForEmployee($simulatedUser);

        $jobPosition = $request->job_position_id
            ? JobPosition::find($request->job_position_id)
            : null;

        return Inertia::render("Admin/Folders/PreviewList", [
            "folders" => $folders->map(fn($folder) => [
                "id" => $folder->id,
                "name" => $folder->name,
                "slug" => $folder->slug,
                "slide_count" => $folder->slideCount(),
            ]),
            "company" => $company,
            "jobPosition" => $jobPosition
        ]);
    }
}