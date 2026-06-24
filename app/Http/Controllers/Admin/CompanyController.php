<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Company;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class CompanyController extends Controller
{
    public function index(): Response
    {
        $companies = Company::withCount("users")
            ->latest()
            ->get();

        return Inertia::render("Admin/Companies/Index", [
            "companies" => $companies
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            "name" => ["required", "string", "max:255"],
            "logo_path" => ["nullable", "image", "max:2048"]
        ]);

        $logoPath = null;
        if ($request->hasFile("logo_path")) {
            $logoPath = $request->file("logo_path")
                ->store("logos", "public");
        }

        Company::create([
            "name" => $validated["name"],
            "slug" => Str::slug($validated["name"]),
            "logo_path" => $logoPath,
            "status" => "active"
        ]);

        return back()->with("success", "Company created successfully");
    }

    public function update(Request $request, Company $company): RedirectResponse
    {
        $validated = $request->validate([
            "name" => ["required", "string", "max:255"],
            "logo_path" => ["nullable", "image", "max:2048"]
        ]);

        $logoPath = $company->logoPath;
        if ($request->hasFile("logo_path")) {
            $logoPath = $request->file("logo_path")
                ->store("logos", "public");
        }

        $company->update([
            "name" => $validated["name"],
            "slug" => Str::slug($validated["name"]),
            "logo_path" => $logoPath
        ]);

        return back()->with("success", "Company updated successfully");
    }

    public function toggleStatus(Company $company): RedirectResponse
    {
        $newStatus = $company->status === "active" ? "inactive" : "active";
        $label = $newStatus === "active" ? "activated" : "deactivated";

        $company->update(["status" => $newStatus]);

        return back()->with("success", "Company {$label} successfully");
    }

    public function destroy(Company $company): RedirectResponse
    {
        $company->delete();

        return back()->with("success", "Company deleted successfully");
    }
}
