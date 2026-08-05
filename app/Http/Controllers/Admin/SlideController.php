<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Company;
use App\Models\Folder;
use App\Models\FolderKeyTopic;
use App\Models\Slide;
use App\Support\PresentationPanelData;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Storage;

class SlideController extends Controller
{
    // Removed the FolderKeyTopic in the parameters since it does not return any data.
    public function index(Company $company, Folder $folder, $topic): Response
    {
        //Since the $topic->id is null this will be the alternative for the id that is missing.
        $topics = FolderKeyTopic::where('folder_id', $folder->id)
                    ->where('slug', $topic)
                    ->first();

        $slides = Slide::where("folder_id", $folder->id)
            ->where("folder_key_topic_id", $topics->id)
            ->orderBy("order")
            ->get();

        $folder->load("company:id,name,slug", "jobPosition:id,name,slug");

        return Inertia::render("Admin/Slides/Index", [
            "company" => $company,
            "folder" => [
                "id" => $folder->id,
                "name" => $folder->name,
                "slug" => $folder->slug,
                "company" => $folder->company,
                "job_position" => $folder->jobPosition
            ],
            "topic" => $topics,
            "slides" => $slides->map(fn($slide) => [
                "id" => $slide->id,
                "type" => $slide->type,
                "file_url" => $slide->file_path,
                "order" => $slide->order
            ]),
            ...PresentationPanelData::build($company)
        ]);
    }

    public function store(Request $request, Folder $folder, FolderKeyTopic $topic): RedirectResponse
    {
        abort_if($topic->folder_id !== $folder->id, 403);

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
            ->where("key_topic_id", $topic->id)
            ->max("order") ?? 0;

        $storageFolder = $this->storagePath($folder);

        foreach ($request->file("files") as $index => $file) {
             $type = str_starts_with($file->getMimeType(), "video")
                ? "video"
                : "image";
            
           $path = Storage::disk('public')->putFile($storageFolder, $file);

            Slide::create([
                "folder_id" => $folder->id,
                "key_topic_id" => $topic->id,
                "type" => $type,
                "file_path" => $path,
                "order" => $lastOrder + $index + 1
            ]);
        }

        return back()->with("success", "Slides uploaded successfully");
    }

    public function reorder(Request $request, Folder $folder): RedirectResponse
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

    public function destroy(Folder $folder, Slide $slide): RedirectResponse
    {
        abort_if($slide->folder_id !== $folder->id, 403);

        Storage::disk(config("filesystems.default"))
            ->delete($slide->file_path);
        
        $slide->delete();

        return back()->with("success", "Slide deleted successfully");
    }

    public function previewFolder(Folder $folder): Response
    {
        $folder->load("slides.keyTopic");

        return Inertia::render("Admin/Slides/Preview", [
            "folder" => $folder,
            "slides" => $folder->slides->map(fn($slide) => [
                "id" => $slide->id,
                "type" => $slide->type,
                "file_url" => $slide->fileUrl(),
                "order" => $slide->order,
                "topic_name" => $slide->keyTopic->label
            ])
        ]);
    }

    private function storagePath(Folder $folder, FolderKeyTopic $topic): string
    {
        $base = $folder->jobPosition_id
            ? "folders/" . $folder->company->slug . "/job-positions/" . $folder->jobPosition->slug . "/" . $folder->slug
            : "folders/" . $folder->company->slug . "/" . $folder->slug;

        return $base . "/" . str($topic->label)->slug();
    }
}