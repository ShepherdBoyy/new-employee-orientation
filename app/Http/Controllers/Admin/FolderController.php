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

        if ($request->isLinkActive) {
            return redirect()->route('admin.folders.topics.index', [
                'company' => $company->slug,
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
            ->whereNotNull("employee_type")
            ->update(["name" => $validated["name"]]);

        return back()->with("success", "Module updated successfully");
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
                    ->whereNotNull("employee_type")
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

        $company = Company::findOrFail($folder->company_id);

        $folder->delete();

        if ($request->isLinkActive) {
            return redirect()->route('admin.folders.company', $company->slug)
                ->with('success', 'Folder deleted successfully.');
        }

        return back()->with("success", "Folder deleted successfully");
    }

    public function previewFolderList(Request $request): Response
    {
        $request->validate([
            'company_id' => ['required', 'exists:companies,id'],
            'employee_type' => ['nullable', 'in:field,non_field'],
        ]);

        $company = Company::findOrFail($request->company_id);

        $employeeType = $request->employee_type ?? 'field';

        $simulatedUser = new User(['company_id' => $request->company_id]);

        $simulatedUser->setRelation(
            'jobPosition',
            new JobPosition(['employee_type' => $employeeType])
        );

        $folders = $company->foldersForEmployee($simulatedUser);

        return Inertia::render('Admin/Folders/PreviewList', [
            'folders' => $folders->map(fn($folder) => [
                'id' => $folder->id,
                'slug' => $folder->slug,
                'name' => $folder->name,
                'slide_count' => $folder->slideCount(),
            ]),
            'company' => $company,
            'employeeType' => $employeeType,
        ]);
    }
}