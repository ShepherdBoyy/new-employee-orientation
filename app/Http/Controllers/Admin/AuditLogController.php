<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AuditLogController extends Controller
{
    public function index(Request $request): Response
    {
        $logs = AuditLog::query()
            ->when($request->filled("search"), function ($query) use ($request) {
                $search = $request->input("search");

                $query->where(function ($q) use ($search) {
                    $q->where("user_name", "like", "%{$search}%")
                        ->orWhere("description", "like", "%{$search}%");
                });
            })
            ->when($request->filled("action") && $request->input("action") !== "all", function ($query) use ($request) {
                $query->where("action", $request->input("action"));
            })
            ->when($request->filled("date_from"), function ($query) use ($request) {
                $query->whereDate("created_at", ">=", $request->input("date_from"));
            })
            ->when($request->filled("date_to"), function ($query) use ($request) {
                $query->whereDate("created_at", "<=", $request->input("date_to"));
            })
            ->latest("created_at")
            ->paginate(20)
            ->withQueryString()
            ->through(fn(AuditLog $log) => [
                "id" => $log->id,
                "user_name" => $log->user_name,
                "user_role" => $log->user_role,
                "action" => $log->action,
                "subject_type" => $log->subject_type,
                "description" => $log->description,
                "old_values" => $log->old_values,
                "new_values" => $log->new_values,
                "ip_address" => $log->ip_address,
                "created_at" => $log->created_at->format("M j, Y g:i A")
            ]);
        
        $actions = AuditLog::query()
            ->select("action")
            ->distinct()
            ->orderBy("action")
            ->pluck("action");

        return Inertia::render("Admin/AuditTrail/Index", [
            "logs" => $logs,
            "actions" => $actions,
            "filters" => $request->only(["search", "action", "date_from", "date_to"])
        ]);
    }
}
