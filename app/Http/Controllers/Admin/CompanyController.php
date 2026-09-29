<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Company;
use App\Support\AuditLogger;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class CompanyController extends Controller
{
    public function index(): Response
    {
        $companies = Company::withCount(["users", "jobs"])
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
            "logo_path" => ["nullable", "image", "max:3048"],
            "header_theme" => ["required", "string"]
        ]);

        $logoPath = null;
        if ($request->hasFile("logo_path")) {
            $logoPath = $request->file("logo_path")
                ->store("logos", "public");
        }

        $company = Company::create([
            "name" => $validated["name"],
            "logo_path" => $logoPath,
            "header_theme" => $validated["header_theme"]
        ]);

        AuditLogger::record(
            "created",
            "Created company \"{$company->name}\"",
            $company,
            [],
            $company->only(["name", "header_theme"])
        );

        return back()->with("success", "Company created successfully");
    }

    public function update(Request $request, Company $company): RedirectResponse
    {
        $validated = $request->validate([
            "name" => ["required", "string", "max:255"],
            "logo_path" => ["nullable", "image", "max:3048"],
            "header_theme" => ["required", "string"]
        ]);

        $oldValues = $company->only(["name", "header_theme"]);
        $logoPath = $company->logo_path;

        if ($request->hasFile("logo_path")) {
            if ($logoPath) {
                Storage::disk("public")->delete($logoPath);
            }

            $logoPath = $request->file("logo_path")->store("logos", "public");
        }

        $company->update([
            "name" => $validated["name"],
            "logo_path" => $logoPath,
            "header_theme" => $validated["header_theme"]
        ]);

        AuditLogger::record(
            "updated",
            "Updated company \"{$company->name}\"",
            $company,
            $oldValues,
            $company->only(["name", "header_theme"])
        );

        return back()->with("success", "Company updated successfully");
    }

    public function destroy(Company $company): RedirectResponse
    {
        if ($company->logo_path) {
            Storage::disk('public')->delete($company->logo_path);
        }

        AuditLogger::record(
            "delete",
            "Deleted company \"{$company->name}\"",
            $company
        );

        $company->delete();

        return back()->with("success", "Company deleted successfully");
    }
}