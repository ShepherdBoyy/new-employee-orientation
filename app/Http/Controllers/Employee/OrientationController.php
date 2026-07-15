<?php

namespace App\Http\Controllers\Employee;

use App\Http\Controllers\Controller;
use App\Models\Folder;
use App\Models\FolderCompletion;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class OrientationController extends Controller
{
    public function welcome(): Response|RedirectResponse
    {
        $user = Auth::user()->load(["company", "jobPosition"]);

        if ($user->hasAcknowledgedOrientation()) {
            return redirect()->route("employee.completed");
        }

        return Inertia::render("Employee/Welcome", [
            "user" => [
                "name" => $user->name,
                "companyName" => $user->company?->name,
                "jobPosition" => $user->jobPosition?->name
            ],
        ]);
    }

    public function index(): Response|RedirectResponse
    {
        $user = Auth::user()->load(["company", "jobPosition"]);

        if ($user->hasAcknowledgedOrientation()) {
            return redirect()->route("employee.completed");
        }

        $folders = $user->company->foldersForEmployee($user);

        $completedIds = FolderCompletion::where("user_id", $user->id)
            ->pluck("folder_id")
            ->toArray();

        $folderList = $folders->values()->map(function (Folder $folder, int $index) use ($completedIds, $folders) {
            $isCompleted = in_array($folder->id, $completedIds);

            $isLocked = false;
            for ($i = 0; $i < $index; $i++) {
                if (!in_array($folders[$i]->id, $completedIds)) {
                    $isLocked = true;
                    break;
                }
            }

            return [
                "id" => $folder->id,
                "slug" => $folder->slug,
                "name" => $folder->name,
                "slide_count" => $folder->slideCount(),
                "completed" => $isCompleted,
                "locked" => $isLocked
            ];
        });

        return Inertia::render("Employee/FolderList", [
            "folders" => $folderList,
            "allCompleted" => $user->hasCompletedAllFolders()
        ]);
    }

    public function showFolder(Folder $folder): Response|RedirectResponse
    {
        $user = Auth::user();
        $folders = $user->company->foldersForEmployee($user)->values();
        $folderIndex = $folders->search(fn($f) => $f->id === $folder->id);

        abort_if($folderIndex === false, 403, "You do not have access to this folder");

        $completedIds = FolderCompletion::where("user_id", $user->id)
            ->pluck("folder_id")
            ->toArray();
        
        for ($i = 0; $i < $folderIndex; $i++) {
            if (!in_array($folders[$i]->id, $completedIds)) {
                return redirect()->route("employee.folders.index")
                    ->withErrors(["folder" => "You must complete the previous module first"]);
            }
        }

        $folder->load("slides");

        return Inertia::render("Employee/FolderViewer", [
            "folder" => [
                "id" => $folder->id,
                "slug" => $folder->slug,
                "name" => $folder->name
            ],
            "slides" => $folder->slides->map(fn($slide) => [
                "id" => $slide->id,
                "type" => $slide->type,
                "file_url" => $slide->fileUrl(),
                "order" => $slide->order
            ]),
            "isCompleted" => in_array($folder->id, $completedIds)
        ]);
    }

    public function completeFolder(Folder $folder): RedirectResponse
    {
        $user = Auth::user();
        $folders = $user->company->foldersForEmployee($user);

        abort_unless($folders->contains("id", $folder->id), 403);

        FolderCompletion::firstOrCreate(
            ["user_id" => $user->id, "folder_id" => $folder->id],
            ["completed_at" => now()]
        );

        if ($user->hasCompletedAllFolders()) {
            return redirect()->route("employee.acknowledgement");
        }

        return redirect()->route("employee.folders.index")
            ->with("success", "Module completed. Keep going!");
    }

    public function acknowledgement(): Response|RedirectResponse
    {
        $user = Auth::user();

        if (!$user->hasCompletedAllFolders()) {
            return redirect()->route("employee.folders.index");
        }

        if ($user->hasAcknowledgedOrientation()) {
            return redirect()->route("employee.completed");
        }

        return Inertia::render("Employee/Acknowledgement", [
            "user" => $user->only("name"),
            "progress" => $user->orientationProgress()
        ]);
    }
}