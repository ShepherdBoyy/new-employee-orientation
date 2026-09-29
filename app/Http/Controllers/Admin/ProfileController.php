<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Support\AuditLogger;
use App\Support\Base64FileStorage;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    public function index(): Response
    {
        $user = Auth::user();

        return Inertia::render("Admin/Profile/Index", [
            "user" => [
                "name" => $user->name,
                "email" => $user->email
            ],
            "signature" => $this->signatureDataUri($user)
        ]);
    }

    public function updateDetails(Request $request): RedirectResponse
    {
        $user = Auth::user();

        $validated = $request->validate([
            "name" => ["required", "string", "max:255"],
            "email" => [
                "required",
                "string",
                "email",
                "max:255",
                Rule::unique("users", "email")->ignore($user->id)
            ]
        ]);

        $user->update($validated);

        return back()->with("success", "Profile updated successfully");
    }

    public function updatePassword(Request $request): RedirectResponse
    {
        $user = Auth::user();

        $validated = $request->validate([
            "current_password" => ["required", "current_password"],
            "password" => ["required", "confirmed", Password::defaults()]
        ]);

        $user->update([
            "password" => $validated["password"]
        ]);

        AuditLogger::record(
            "updated",
            "{$user->name} changed their password",
            $user
        );

        return back()->with("success", "Password updated successfully");
    }

    public function updateSignature(Request $request): RedirectResponse
    {
        $user = Auth::user();

        $validated = $request->validate([
            "signature" => ["required", "string"]
        ]);

        $hadSignature = $user->hasSignature();

        if ($user->signature_path) {
            Storage::disk("private")->delete($user->signature_path);
        }

        $path = Base64FileStorage::store(
            $validated["signature"],
            "signature/admins",
            $user->id . "_" . now()->timestamp . "signature.png"
        );

        $user->update(["signature_path" => $path]);

        AuditLogger::record(
            $hadSignature ? "updated" : "created",
            $hadSignature
                ? "{$user->name} replaced their e-signature"
                : "{$user->name} added an e-signature",
            $user
        );

        return back()->with("success", "Signature saved successfully");
    }

    public function removeSignature(): RedirectResponse
    {
        $user = Auth::user();

        if ($user->signature_path) {
            Storage::disk("private")->delete($user->signature_path);
        }

        $user->update(["signature_path" => null]);

        AuditLogger::record(
            "deleted",
            "{$user->name} remove their e-signature",
            $user
        );

        return back()->with("success", "Signature removed successfully");
    }

    private function signatureDataUri($user): ?string
    {
        if (!$user->hasSignature() || !Storage::disk("private")->exists($user->signature_path)) {
            return null;
        }

        $contents = Storage::disk("private")->get($user->signature_path);

        return "data:image/png;base64," . base64_encode($contents);
    }
}