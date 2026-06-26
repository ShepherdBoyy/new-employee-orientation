<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Company;
use App\Models\Slide;
use DB;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class SlideController extends Controller
{
    private function getLastOrder(string $scope, ?int $companyId): int
    {
        return match($scope) {
            "global" => Slide::global()->max("order") ?? 0,
            "library" => Slide::library()->max("order") ?? 0,
            "company" => Slide::forCompany($companyId)->max("order") ?? 0
        };
    }

    private function getCompanySlideLastOrder(int $companyId): int
    {
        return DB::table('company_slides')
            ->where("company_id", $companyId)
            ->max("order") ?? 0;
    }

    public function library(): Response
    {
        $globalSlides = Slide::global()->orderBy("order")->get();
        $librarySlides = Slide::library()->orderBy("order")->get();

        return Inertia::render("Admin/Slides/Library", [
            "globalSlides" => $globalSlides,
            "librarySlides" => $librarySlides
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            "scope" => ["required", "in:global,library,company"],
            "company_id" => [
                "nullable",
                "exists:companies,id",
                Rule::requiredif($request->scope === "company")
            ],
            "files" => ["required", "array", "min:1"],
            "files.*" => ["required", "file", "mimetypes:image/jpeg,image/png,image/webp,video/mp4,video/quicktime", 'max:102400']
        ]);

        $folder = match($validated["scope"]) {
            "global" => "slides/global",
            "library" => "slides/library",
            'company' => "slides/" . Company::findOrFail($validated["company_id"])->slug
        };

        $lastOrder = $this->getLastOrder($validated["scope"], $validated["company_id"]);

        foreach ($request->file("files") as $index => $file) {
            $type = str_starts_with($file->getMimeType(), "video") ? "video" : "image";
            $path = $file->store($folder, config("filesystems.default"));

            $slide = Slide::create([
                "company_id" => $validated["scope"] === "company" ? $validated["company_id"] : null,
                "type" => $type,
                "file_path" => $path,
                "order" => $lastOrder + $index + 1,
                "is_global" => $validated["scope"] === "global"
            ]);

            if ($validated["scope"] === "company") {
                $companyLastOrder = $this->getCompanySlideLastOrder($validated["company_id"]);

                Company::findOrFail($validated["company_id"])
                    ->companySlides()
                    ->attach($slide->id, ["order" => $companyLastOrder + $index + 1]);
            }
        }

        return back()->with("success", "Slide uploaded successfully");
    }

    public function reorderLibrary(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            "slides" => ["required", "array"],
            "slides.*.id" => ["required", "exists:slides,id"],
            "slides.*.order" => ["required", "integer", "min:1"]
        ]);

        foreach ($validated["slides"] as $item) {
            Slide::where("id", $item["id"])
                ->update(["order" => $item["order"]]);
        }

        return back()->with("success", "Slides reordered successfully");
    }

    public function destroy(Slide $slide): RedirectResponse
    {
        Storage::disk(config("filesystems.default"))->delete($slide->file_path);
        $slide->delete();

        return back()->with("success", "Slide deleted successfully");
    }

    public function builder(Request $request): Response
    {
        $validated = $request->validate([
            "company_id" => ["required", "exists:companies,id"]
        ]);

        $company = Company::findOrFail($validated["company_id"]);
        $assignedSlides = $company->companySlides;
        $availableSlides = Slide::library()
            ->whereNotIn("id", $assignedSlides->pluck("id"))
            ->orderBy("order")
            ->get();
        $globalSlides = Slide::global()->orderBy("order")->get();
        $companies = Company::where("status", "active")->get(["id", "name"]);

        return Inertia::render("Admin/Slides/Builder", [
            "company" => $company,
            "companies" => $companies,
            "assignedSlides" => $assignedSlides,
            "availableSlides" => $availableSlides,
            "globalSlides" => $globalSlides,
        ]);
    }

    public function assignSlide(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'company_id' => ["required", "exists:companies,id"],
            "slide_id" => ["required", "exists:slides,id"],
        ]);

        $company = Company::findOrFail($validated["company_id"]);
        $alreadyAssigned = $company->companySlides()
            ->where("slide_id", $validated["slide_id"])
            ->exists();

        if ($alreadyAssigned) {
            return back()->withErrors(["slide_id" => "This slide is already assigned"]);
        }

        $lastOrder = $this->getCompanySlideLastOrder($validated["company_id"]);

        $company->companySlides()->attach($validated["slide_id"], [
            "order" => $lastOrder + 1
        ]);

        return back()->with("success", "Slide assigned successfully");
    }

    public function unassignedSlide(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            "company_id" => ["required", "exists:companies,id"],
            "slide_id" => ["required", "exists:slides,id"],
        ]);

        Company::findOrFail($validated["company_id"])
            ->companySlides()
            ->detach($validated["slide_id"]);
        
        return back()->with("success", "Slide removed successfully");
    }

    public function reorderCompanySlides(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            "company_id" => ["required", "exists:companies,id"],
            "slides" => ["required", "array"],
            'slides.*.id' => ["required", "exists:slides,id"],
            "slides.*.order" => ["required", "integer", "min:1"]
        ]);

        $company = Company::findOrFail($validated["company_id"]);

        foreach ($validated["slides"] as $item) {
            $company->companySlides()->updateExistingPivot($item["id"], [
                "order" => $item["order"]
            ]);
        }

        return back()->with("success", "Order updated successfully");
    }

    public function preview(Request $request): Response
    {
        $validated = $request->validate([
            "company_id" => ["required", "exists:companies,id"]
        ]);

        $company = Company::findOrFail($validated["company_id"]);
        $slides = $company->orientationSlides();

        return Inertia::render("Admin/Slides/Preview", [
            "slides" => $slides,
            "company" => $company
        ]);
    }
}