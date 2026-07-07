<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Folder;
use App\Models\Slide;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Storage;

class FolderController extends Controller
{
    public function index(): Response
    {
        $folders = Folder::ordered()
            ->withCount("slides")
            ->with("targets.company")
            ->with("targets.JobPosition")
            ->get();
        
        return Inertia::render("Admin/Folders/Index", [
            "folders" => $folders
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            "name" => ["required", "string", "max:255"]
        ]);

        $lastOrder = Folder::max("order") ?? 0;

        Folder::create([
            "name" => $validated["name"],
            "order" => $lastOrder + 1
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

    public function destroy(Folder $folder): RedirectResponse
    {
        $folder->slides->each(function (Slide $slide) {
            Storage::disk(config("filesystems.default"))
                ->delete($slide->file_path);
        });

        $folder->delete();

        return back()->with("success", "Folder deleted successfully");
    }
}