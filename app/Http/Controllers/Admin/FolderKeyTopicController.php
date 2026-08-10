<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Company;
use App\Models\Folder;
use App\Models\FolderKeyTopic;
use App\Support\PresentationPanelData;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class FolderKeyTopicController extends Controller
{
    public function index(Company $company, Folder $folder): Response
    {
        $folder->load("company:id,name,slug", "jobPosition:id,name,slug");

        $topics = $folder->keyTopics()
            ->with("folder:id,name,slug")
            ->withCount("slides")
            ->ordered()
            ->get();

        return Inertia::render("Admin/Topics/Index", [
            "company" => $company,
            "activeFolder" => [
                "id" => $folder->id,
                "slug" => $folder->slug,
                "name" => $folder->name,
                "is_job_specific" => $folder->job_position_id !== null,
                "job_position" => $folder->jobPosition
            ],
            "topics" => $topics,
            ...PresentationPanelData::build($company)
        ]);
    }

    public function store(Request $request, Folder $folder): RedirectResponse
    {
        $validated = $request->validate([
            'label' => ["required", "string", "max:255"]
        ]);

        $lastOrder = $folder->keyTopics()->max("order") ?? 0;

        $folder->keyTopics()->create([
            'label' => $validated["label"],
            "order" => $lastOrder + 1
        ]);

        return back()->with("success", "Topic created successfully");
    }

    public function update(Request $request, FolderKeyTopic $topic): RedirectResponse
    {
        $validated = $request->validate([
            "label" => ["required", "string", "max:255"]
        ]);

        $topic->update(["label" => $validated["label"]]);

        return back()->with("success", "Topic updated successfully");
    }

    public function reorder(Request $request, Folder $folder): RedirectResponse
    {
        $validated = $request->validate([
            "topics" => ["required", "array"],
            "topics.*.label" => ["required", "exists:folder_key_topics,id"],
            "topics.*.order" => ["required", "integer", "min:1"]
        ]);

        foreach ($validated["topics"] as $item) {
            FolderKeyTopic::where("id", $item["id"])
                ->where("folder_id", $folder->id)
                ->update(["order" => $item["order"]]);
        }

        return back()->with("success", "Topics reordered successfully");
    }

    public function destroy(FolderKeyTopic $topic): RedirectResponse
    {
        $topic->delete();

        return back()->with("success", "Topic deleted successfully");
    }
}
