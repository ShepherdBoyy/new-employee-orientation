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

        return Inertia::render("Employee/Welcome", [
            "folders" => $folderList,
            "user" => [
                "name" => $user->name,
                "companyName" => $user->company?->name,
                "jobPosition" => $user->jobPosition?->name
            ],
            "allCompleted" => $user->hasCompletedAllFolders()
        ]);
    }
}