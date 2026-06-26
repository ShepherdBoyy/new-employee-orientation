<?php

namespace App\Http\Controllers\Employee;

use App\Http\Controllers\Controller;
use App\Models\Acknowledgement;
use App\Models\ExtensionRequest;
use App\Models\Slide;
use App\Models\User;
use App\Notifications\ExtensionRequestSubmitted;
use App\Notifications\OrientationCompleted;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class OrientationController extends Controller
{
    public function index(): Response|RedirectResponse
    {
        $user = Auth::user();

        if ($user->hasCompletedOrientation()) {
            return redirect()->route("employee.completed");
        }

        $slides = $user->company->orientationSlides();

        $acknowledgeIds = Acknowledgement::where("user_id", $user->id)
            ->pluck("slide_id")
            ->toArray();
        
        $currentSlide = $slides->first(function ($slide) use ($acknowledgeIds) {
            return !in_array($slide->id, $acknowledgeIds);
        });

        return Inertia::render("Employee/Orientation", [
            "slides" => $slides->values(),
            "acknowledgeIds" => $acknowledgeIds,
            "currentSlideId" => $currentSlide?->id
        ]);
    }

    public function acknowledge(Request $request): RedirectResponse
    {
        $user = Auth::user();

        $validated = $request->validate([
            "slide_id" => ["required", "exists:slides,id"]
        ]);

        $allSlideIds = $user->company
            ->orientationSlides()
            ->pluck("id")
            ->toArray();

        abort_unless(in_array($validated["slide_id"], $allSlideIds), 403);

        Acknowledgement::firstOrCreate(
            [
                "user_id" => $user->id,
                "slide_id" => $validated["slide_id"]
            ],
            ["acknowledge_at" => now()]
        );

        if ($user->hasCompletedOrientation()) {
            $admins = User::where("role", "admin")->get();
            
            foreach ($admins as $admin) {
                $admin->notify(new OrientationCompleted($user));
            }

            return redirect()->route("employee.completed");
        }

        return back()->with("success", "Slide acknowledged");
    }

    public function completed(): Response|RedirectResponse
    {
        $user = Auth::user();

        if (!$user->hasCompletedOrientation()) {
            return redirect()->route("employee.orientation");
        }

        return Inertia::render("Employee/Completed", [
            "user" => $user->only("name")
        ]);
    }

    public function locked(): Response
    {
        $user = Auth::user();

        $hasPendingRequest = ExtensionRequest::where("user_id", $user->id)
            ->where("status", "pending")
            ->exists();
        
        return Inertia::render("Employee/AccountLocked", [
            "hasPendingRequest" => $hasPendingRequest
        ]);
    }

    public function requestExtension(Request $request): RedirectResponse
    {
        $user = Auth::user();

        $validated = $request->validate([
            "reason" => ["required", "string", "max:1000"]
        ]);

        $alreadyPending = ExtensionRequest::where("user_id", $user->id)
            ->where("status", "pending")
            ->exists();
        
        if ($alreadyPending) {
            return back()->withErrors([
                "reason" => "You already have a pending extension request"
            ]);
        }

        ExtensionRequest::create([
            "user_id" => $user->id,
            "reason" => $validated["reason"],
            "status" => "pending",
            "requested_at" => now()
        ]);

        $admins = User::where("role", "admin")->get();
        foreach ($admins as $admin) {
            $admin->notify(new ExtensionRequestSubmitted($user));
        }

        return back()->with("success", "Extension request submitted. An admin will review it shortly");
    }
}
