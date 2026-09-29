<?php

namespace App\Http\Controllers\Employee;

use App\Http\Controllers\Controller;
use App\Mail\OrientationCompletedMail;
use App\Models\Folder;
use App\Models\FolderCompletion;
use App\Models\OrientationAcknowledgement;
use App\Models\User;
use App\Notifications\OrientationCompleted;
use App\Support\Base64FileStorage;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;
use Inertia\Response;
use Storage;

class OrientationController extends Controller
{
    public function welcome(): Response|RedirectResponse
    {
        $user = Auth::user()->load(["company", "jobPosition"]);

        if ($user->hasAcknowledgedOrientation()) {
            return redirect()->route("employee.completed");
        }

        if ($user->welcome_viewed_at !== null) {
            return redirect()->route("employee.folders.index");
        }

        return Inertia::render("Employee/Welcome", [
            "user" => [
                "name" => $user->name,
                "companyName" => $user->company?->name,
                "jobPosition" => $user->jobPosition?->name
            ],
        ]);
    }

    public function beginOrientation()
    {
        $user = Auth::user();

        if ($user->welcome_viewed_at === null) {
            $user->update(["welcome_viewed_at" => now()]);
        }

        return redirect()->route("employee.folders.index");
    }

    public function markJdViewed(): RedirectResponse
    {
        $user = Auth::user();

        if ($user->jd_viewed_at === null) {
            $user->update(["jd_viewed_at" => now()]);
        }

        return back();
    }

    public function index(): Response|RedirectResponse
    {
        $user = Auth::user()->load(["company.document", "jobPosition"]);

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

        $document = $user->company->document->where('job_position_id', $user->jobPosition->id)->first()?->file_path;

        return Inertia::render("Employee/FolderList", [
            "folders" => $folderList,
            "allCompleted" => $user->hasCompletedAllFolders(),
            "user" => [
                "name" => $user->name,
                "companyName" => $user->company?->name,
                "jobPosition" => $user->jobPosition?->name,
                "jd_path" => $document,
                "jd_viewed" => $user->hasViewedJobDescription()
            ],
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

        $folder->load("keyTopics.slides");

        $slides = $folder->keyTopics
            ->sortBy("order")
            ->flatMap(function ($topic) {
                return $topic->slides->sortBy("order")->map(fn($slide) => [
                    "id" => $slide->id,
                    "type" => $slide->type,
                    "file_url" => $slide->fileUrl(),
                    "order" => $slide->order,
                    "topic_id" => $topic->id,
                    "topic_name" => $topic->label
                ]);
            })->values();

        return Inertia::render("Employee/FolderViewer", [
            "folder" => [
                "id" => $folder->id,
                "slug" => $folder->slug,
                "name" => $folder->name
            ],
            "slides" => $slides,
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
        $user = Auth::user()->load("company.document", "jobPosition");

        if (!$user->hasCompletedAllFolders()) {
            return redirect()->route("employee.folders.index");
        }

        if ($user->hasAcknowledgedOrientation()) {
            return redirect()->route("employee.completed");
        }

        return Inertia::render("Employee/Acknowledgement", [
            "user" => $user->only("name"),
            "progress" => $user->orientationProgress(),
            "jdPath" => $user->jobDescriptionPath(),
            "jdViewed" => $user->hasViewedJobDescription()
        ]);
    }

    public function submitAcknowledgement(Request $request): RedirectResponse
    {
        $user = Auth::user();

        if (!$user->hasCompletedAllFolders()) {
            return back()->withErrors(["error" => "You must complete all modules first"]);
        }

        if ($user->jobDescriptionPath() !== null && !$user->hasViewedJobDescription()) {
            return back()->withErrors(["error" => "You must view your Job Description/KPI first"]);
        }

        if ($user->hasAcknowledgedOrientation()) {
            return redirect()->route("employee.completed");
        }

        $validated = $request->validate([
            "full_name" => [
                "required",
                "string",
                function ($attribute, $value, $fail) use ($user) {
                    if (strtolower(trim($value)) !== strtolower(trim($user->name))) {
                        $fail("Your name does not match our records. Please type your full name exactly as registered");
                    }
                }
            ],
            "signature" => ["required", "string"],
            "photo" => ["required", "string"],
            "consented" => ["required", "accepted"]
        ]);

        $signaturePath = Base64FileStorage::store(
            $validated["signature"],
            "acknowledgements/signatures",
            $user->id . "_" . now()->timestamp . "_signature.png"
        );

        $photoPath = Base64FileStorage::store(
            $validated["photo"],
            "acknowledgements/photos",
            $user->id . "_" . now()->timestamp . "_photo.jpg"
        );

        $acknowledgedAt = now()->format("F j, Y g:i A");

        $hash = OrientationAcknowledgement::generateHash(
            $user->id,
            $validated["full_name"],
            $signaturePath,
            $photoPath,
            $acknowledgedAt
        );

        OrientationAcknowledgement::create([
            "user_id" => $user->id,
            "full_name_confirmation" => $validated["full_name"],
            "signature_path" => $signaturePath,
            "photo_path" => $photoPath,
            "integrity_hash" => $hash,
            "ip_address" => $request->ip(),
            "user_agent" => $request->userAgent(),
            "acknowledged_at" => $acknowledgedAt
        ]);

        $admins = User::where("role", "admin")->get();
        foreach ($admins as $admin) {
            $admin->notify(new OrientationCompleted($user));

            Mail::to($admin->email)->send(
                new OrientationCompletedMail($user, $acknowledgedAt)
            );
        }

        return redirect()->route("employee.completed");
    }

    public function completed(): Response|RedirectResponse
    {
        $user = Auth::user();

        if (!$user->hasAcknowledgedOrientation()) {
            return redirect()->route("employee.welcome");
        }

        $acknowledgement = $user->orientationAcknowledgement;

        $folders = $user->company->foldersForEmployee($user)->values();

        $completedIds = FolderCompletion::where("user_id", $user->id)
            ->pluck("folder_id")
            ->toArray();

        return Inertia::render("Employee/Completed", [
            "user" => $user->only("name"),
            "acknowledgedAt" => $acknowledgement->acknowledged_at->format("F j, Y g:i A"),
            "folders" => $folders->map(fn($folder) => [
                "id" => $folder->id,
                "slug" => $folder->slug,
                "name" => $folder->name,
                "slide_count" => $folder->slideCount(),
                "completed" => in_array($folder->id, $completedIds)
            ]),
        ]);
    }

    public function locked(): Response
    {
        return Inertia::render("Employee/AccountExpired");
    }

    private function storeBase64File(string $base64, string $folder, string $filename): string
    {
        $data = preg_replace("/^data:\w+\/[a-zA-Z0-9.+-]+;base64,/", "", $base64);
        $decoded = base64_decode($data);

        $path = $folder . "/" . $filename;

        Storage::disk("private")->put($path, $decoded);

        return $path;
    }
}