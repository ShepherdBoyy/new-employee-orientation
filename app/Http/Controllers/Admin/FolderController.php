<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Company;
use App\Models\Folder;
use App\Models\JobPosition;
use App\Models\Slide;
use App\Models\User;
use App\Support\PresentationPanelData;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Storage;

class FolderController extends Controller
{
    public function companyIndex(Company $company): Response
    {
        return Inertia::render("Admin/Folders/Empty", [
            "company" => $company,
            ...PresentationPanelData::build($company)
        ]); 
    }

    public function jobPositionPicker(Company $company): Response
    {
        $company->load("jobs:id,name,slug");

        $folders = Folder::forCompany($company->id)
            ->whereNotNull("job_position_id")
            ->get(["id", "job_position_id", "slug"]);

        $positions = $company->jobs->map(fn(JobPosition $position) => [
            "id" => $position->id,
            "name" => $position->name,
            "has_folder" => $folders->contains("job_position_id", $position->id),
            "folder_slug" => $folders->firstWhere("job_position_id", $position->id)?->slug,
        ]);

        return Inertia::render("Admin/Folders/JobPositionPicker", [
            "company" => $company,
            "positions" => $positions,
            ...PresentationPanelData::build($company)
        ]);
    }

    public function resolveJobSpecificFolder(Company $company, JobPosition $jobPosition): RedirectResponse
    {
        // $folder = Folder::ensureJobSpecificFolder($company->id, $jobPosition->id);

        $folder = Folder::where("company_id", $company->id)
            ->where("job_position_id", $jobPosition->id)
            ->first();

        return redirect()->route("admin.folders.topics.index", [
            "company" => $company->slug,
            "folder" => $folder->slug
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            "name" => ["required", "string", "max:255"],
            "company_id" => ["required", "exists:companies,id"],
        ]);

        $lastOrder = Folder::forCompany($validated["company_id"])
            ->companyWide()
            ->max("order") ?? 0;

        Folder::create([
            "company_id" => $validated["company_id"],
            "name" => $validated["name"],
            "order" => $lastOrder + 1
        ]);

        return back()->with("success", "Folder created successfully");
    }

    public function update(Request $request, Folder $folder): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ["required", "string", "max:255"],
        ]);

        $folder->update(["name" => $validated["name"]]);

        $company = Company::findOrFail($folder->company_id);

        if($request->isLinkActive){
            return redirect()->route('admin.folders.topics.index', [
                'company' => $company->slug, // or pass the $company model instance directly
                'folder' => $folder->slug,
            ])->with('success', 'Folder deleted successfully.');
        }

        return back()->with("success", "Folder updated successfully");
    }

    public function updateJobSpecific(Request $request, Company $company): RedirectResponse
    {
        $validated = $request->validate([
            "name" => ["required", "string", "max:255"],
        ]);

        Folder::where("company_id", $company->id)
            ->whereNotNull("job_position_id")
            ->update(["name" => $validated["name"]]);

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

    public function destroy(Folder $folder, Request $request): RedirectResponse
    {
        Slide::where("folder_id", $folder->id)->get()->each(function (Slide $slide) {
            Storage::disk(config("filesystems.default"))->delete($slide->file_path);
        });
        $folder->delete();

        $company = Company::findOrFail($folder->company_id);

        if($request->isLinkActive){
            return redirect()->route('admin.folders.company', $company->slug) // Adjust to your index route name
            ->with('success', 'Folder deleted successfully.');
        }
    
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