<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;

class NotificationController extends Controller
{
    public function index(): JsonResponse
    {
        $notifications = Auth::user()
            ->notifications()
            ->latest()
            ->limit(20)
            ->get()
            ->map(fn($n) => [
                "id" => $n->id,
                "message" => $n->data["message"] ?? "New notification",
                "read" => $n->read_at !== null,
                "created_at" => $n->created_at->diffForHumans(),
                "employee_id" => $n->data["employee_id"] ?? null
            ]);

        return response()->json([
            "notifications" => $notifications,
            "unread_count" => Auth::user()->unreadNotifications()->count()
        ]);
    }

    public function markAsRead(string $id): RedirectResponse
    {
        $notification = Auth::user()->notifications()->findOrFail($id);
        $notification->markAsRead();

        return back();
    }

    public function markAllAsRead(): RedirectResponse
    {
        Auth::user()->unreadNotifications()->update(["read_at" => now()]);

        return back();
    }
}
