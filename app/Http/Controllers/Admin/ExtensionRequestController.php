<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ExtensionRequest;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class ExtensionRequestController extends Controller
{
    public function extensionRequests(): Response
    {
        $requests = ExtensionRequest::with("user.company")
            ->where("status", "pending")
            ->latest("requested_at")
            ->get();
        
        return Inertia::render("Admin/ExtensionRequests/Index", [
            "requests" => $requests
        ]);
    }

    public function approveExtension(ExtensionRequest $extensionRequest): RedirectResponse
    {
        $extensionRequest->approve();

        return back()->with("success", "Extension approved. Employee account reactivated");
    }

    public function denyExtension(ExtensionRequest $extensionRequest): RedirectResponse
    {
        $extensionRequest->deny();

        return back()->with("success", "Extension request denied");
    }
}
