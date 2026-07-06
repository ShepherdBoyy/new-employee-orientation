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

    public function show(Folder $folder): Response
    {
        $folder->load("slides", "targets.company", "targets.jobPosition");

        return Inertia::render("Admin/Folders/Show", [
            "folder" => $folder
        ]);
    }

    public function storeSlide(Request $request, Folder $folder): RedirectResponse
    {
        $request->validate([
            "files" => ["required", "array", "min:1"],
            "files.*" => [
                "required",
                "file",
                "mimetypes:image/jpeg,image/png,image/webp,video/mp4,video/quicktime",
                "max:102400"
            ]
        ]);

        $lastOrder = Slide::where("folder_id", $folder->id)
            ->max("order") ?? 0;

        foreach ($request->file("files") as $index => $file) {
             $type = str_starts_with($file->getMimeType(), "video")
                ? "video"
                : "image";
            
            $path = $file->store(
                "folders/" . $folder->id,
                config("filesystems.default")
            );

            Slide::create([
                "folder_id" => $folder->id,
                "type" => $type,
                "file_path" => $path,
                "order" => $lastOrder + $index + 1
            ]);
        }

        return back()->with("success", "Slides uploaded successfully");
    }

    public function reorderSlides(Request $request, Folder $folder): RedirectResponse
    {
        $validated = $request->validate([
            "slides" => ["required", "array"],
            "slides.*.id" => ["required", "exists:slides,id"],
            "slides.*.order" => ["required", "integer", "min:1"]
        ]);

        foreach ($validated["slides"] as $item) {
            Slide::where("id", $item["id"])
                ->where("folder_id", $folder->id)
                ->update(["order" => $item["order"]]);
        }

        return back()->with("success", "Slides reordered successfully");
    }

    public function destroySlide(Folder $folder, Slide $slide): RedirectResponse
    {
        abort_if($slide->folder_id !== $folder->id, 403);

        Storage::disk(config("filesystems.default"))
            ->delete($slide->file_path);
        
        $slide->delete();

        return back()->with("success", "Slide deleted successfully");
    }
}
