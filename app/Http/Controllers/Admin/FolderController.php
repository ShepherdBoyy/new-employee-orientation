<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Company;
use App\Models\Folder;
use App\Models\FolderTarget;
use App\Models\JobPosition;
use App\Models\Slide;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;
use Storage;

class FolderController extends Controller
{
    public function globalIndex(): Response
    {
        $folders = Folder::whereHas("targets", function ($query) {
            $query->whereNull("company_id")
                  ->whereNull("job_position_id");
        })
        ->withCount("slides")
        ->with("targets")
        ->get()
        ->sortBy(function ($folder) {
            return $folder->targets
                ->firstWhere(fn($t) => $t->company_id === null && $t->job_position_id === null)
                ?->order ?? 0;
        })->values();
    
        return Inertia::render("Admin/Folders/Global", [
            "folders" => $folders
        ]);
    }

    public function companyIndex(Company $company): Response
    {
        $company->load("jobs");

        $folders = Folder::whereHas("targets", function ($query) use ($company) {
            $query->where("company_id", $company->id)
                  ->whereNull("job_position_id");
        })
        ->withCount("slides")
        ->with("targets")
        ->get()
        ->sortBy(function ($folder) use ($company) {
            return $folder->targets
                ->firstWhere(fn($t) => $t->company_id === $company->id && $t->job_position_id === null)
                ?->order ?? 0;
        })->values();

        return Inertia::render("Admin/Folders/Company", [
            "company" => $company,
            "folders" => $folders
        ]);
    }

    public function positionIndex(Company $company, JobPosition $job): Response
    {
        $folders = Folder::whereHas("targets", function ($query) use ($company, $job) {
            $query->where("company_id", $company->id)
                  ->where("job_position_id", $job->id);
        })
        ->withCount("slides")
        ->with("targets")
        ->get()
        ->sortBy(function ($folder) use ($company, $job) {
            return $folder->targets
                ->firstWhere(fn($t) => $t->company_id === $company->id && $t->job_position_id === $job->id)
                ?->order ?? 0;
        })->values();

        return Inertia::render("Admin/Folders/Position", [
            "company" => $company,
            "jobPosition" => $job,
            "folders" => $folders
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            "name" => ["required", "string", "max:255"],
            "context" => ["required", "in:global,company,position"],
            "company_id" => [
                "nullable",
                "exists:companies,id",
                Rule::requiredIf(
                    in_array($request->context, ["company", "position"])
                )
            ],
            "job_position_id" => [
                "nullable",
                "exists:job_positions,id",
                Rule::requiredIf(
                    $request->context === "position"
                )
            ]
        ]);

        $lastOrder = Folder::max("order") ?? 0;

        $folder = Folder::create([
            "name" => $validated["name"],
            "order" => $lastOrder + 1
        ]);

        $targetCompanyId = $validated["context"] === "global" ? null : $validated["company_id"];
        $targetJobPositionId = $validated["context"] === "position" ? $validated["job_position_id"] : null;

        $targetOrder = FolderTarget::where("company_id", $targetCompanyId)
            ->where("job_position_id", $targetJobPositionId)
            ->max("order") ?? 0;

        FolderTarget::create([
            "folder_id" => $folder->id,
            "company_id" => $targetCompanyId,
            "job_position_id" => $targetJobPositionId,
            "order" => $targetOrder + 1
        ]);

        return back()->with("success", "Folder created successfully");
    }

    public function update(Request $request, Folder $folder): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ["required", "string", "max:255"]
        ]);

        $folder->update(["name" => $validated["name"]]);

        return back()->with("success", "Folder updated successfully");
    }

    public function reorder(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            "folders" => ["required", "array"],
            "folders.*.id" => ["required", "exists:folders,id"],
            "folders.*.order" => ["required", "integer", "min:1"]
        ]);
        
        foreach ($validated["folders"] as $item) {
            Folder::where("id", $item["id"])
                ->update(["order" => $item["order"]]);
        }

        return back()->with("success", "Folders reordered successfully");
    }

    public function reorderTargets(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            "company_id" => ["nullable", "exists:companies,id"],
            "job_position_id" => ["nullable", "exists:job_positions,id"],
            "folders" => ["required", "array"],
            "folders.*.id" => ["required", "exists:folders,id"],
            "folders.*.order" => ["required", "integer", "min:1"]
        ]);

        foreach ($validated["folders"] as $item) {
            FolderTarget::where("folder_id", $item["id"])
                ->where("company_id", $validated["company_id"])
                ->where("job_position_id", $validated["job_position_id"])
                ->update(["order" => $item["order"]]);
        }

        return back()->with("success", "Folder reordered successfully");
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
                "slide_count" => $folder->slideCount(),
            ]),
            "company" => $company,
            "jobPosition" => $jobPosition
        ]);
    }
}