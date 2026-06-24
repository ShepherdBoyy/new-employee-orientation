<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Company;
use App\Models\Slide;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class SlideController extends Controller
{
    public function index(): Response
    {
        $companies = Company::where("status", "active")
            ->get(["id", "name"]);

        $slides = collect();
        $selectedCompany = null;

        if (request()->has("company_id")) {
            $selectedCompany = Company::findOrFail(request("company_id"));
            $slides = Slide::where("company_id", $selectedCompany->id)
                ->orderBy("order")
                ->get();
        }

        return Inertia::render("Admin/Slides/Index", [
            "companies" => $companies,
            "slides" => $slides,
            "selectedCompany" => $selectedCompany
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            "company_id" => ["required", "exists:companies,id"],
            "images" => ["required", "array", "min:1"],
            "images.*" => ["required", "image", "max:5120"]
        ]);

        $lastOrder = Slide::where("company_id", $request->company_id)
            ->max("order") ?? 0;

        foreach ($request->file("images") as $index => $image) {
            $path = $image->store("slides", "public");

            Slide::create([
                "company_id" => $request->company_id,
                "image_path" => $path,
                "order" => $lastOrder + $index + 1,
            ]);
        }

        return back()->with("success", "Slides uploaded successfully");
    }

    public function reorder(Request $request): RedirectResponse
    {
        $request->validate([
            "slides" => ["required", "array"],
            "slides.*.id" => ["required", "exists:slides,id"],
            "slides.*.order" => ["required", "integer", "min:1"]
        ]);

        foreach ($request->slides as $item) {
            Slide::where("id", $item["id"])
                ->update(["order" => $item["order"]]);            
        }

        return back()->with("success", "Slides reordered successfully");
    }

    public function destroy(Slide $slide): RedirectResponse
    {
        Storage::disk("public")->delete($slide->image_path);
        $slide->delete();

        return back()->with("success", "Slide deleted successfully");
    }
}
