<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Company;
use App\Models\Folder;
use App\Models\FolderTarget;
use App\Models\JobPosition;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class FolderTargetController extends Controller
{
    public function index(): Response
    {
        $folders = Folder::ordered()
            ->with(["targets.company", "targets.jobPosition"])
            ->withCount("slides")
            ->get();

        $companies = Company::where("status", "active")
            ->get(["id", "name"]);

        return Inertia::render("Admin/FolderTargets/Index", [
            "folders" => $folders,
            "companies" => $companies
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            "folder_id" => ["required", "exists:folders,id"],
            "all_companies" => ["required", "boolean"],
            "all_positions" => ["required", "boolean"],
            "company_ids" => ["array", Rule::requiredIf(!$request->boolean("all_companies"))],
            "company_ids.*" => ["exists:companies,id"],
            "job_position_ids" => ["array", Rule::requiredIf(!$request->boolean("all_positions"))],
            "job_position_ids.*" => ["exists:job_positions,id"]
        ]);

        $companyIds = $request->boolean("all_companies") ? [null] : $validated["company_ids"];
        $positionIds = $request->boolean("all_positions") ? [null] : $validated["job_position_ids"];

        $this->validatePositionsBelongToCompanies(
            $validated["all_companies"],
            $validated["all_positions"],
            $companyIds,
            $positionIds
        );

        $combinations = $this->buildCombinations($companyIds, $positionIds);

        $lastOrder = FolderTarget::where("folder_id", $validated["folder_id"])
            ->max("order") ?? 0;
        
        $created = 0;
        $skipped = 0;

        foreach ($combinations as $index => $combination) {
            $alreadyExists = FolderTarget::where("folder_id", $validated["folder_id"])
                ->where("company_id", $combination["company_id"])
                ->where("job_position_id", $combination["job_position_id"])
                ->exists();
            
            if ($alreadyExists) {
                $skipped++;
                continue;
            }

            FolderTarget::create([
                "folder_id" => $validated["folder_id"],
                "company_id" => $combination["company_id"],
                "job_position_id" => $combination["job_position_id"],
                "order" => $lastOrder + $created + 1
            ]);

            $created++;
        }

        $message = $created . " targeting " . str("rule")->plural($created) . " added";

        if ($skipped > 0) {
            $message .= " " . $skipped . " duplicate " . str("rule")->plural($skipped) . " skipped";
        }

        return back()->with("success", $message);
    }

    public function reorder(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            "targets" => ["required", "array"],
            "targets.*.id" => ["required", "exists:folder_targets,id"],
            "targets.*.order" => ["required", "integer", "min:1"]
        ]);

        foreach ($validated["targets"] as $item) {
            FolderTarget::where("id", $item["id"])
                ->update(["order" => $item["order"]]);
        }

        return back()->with("success", "Order updated successfully");
    }

    public function destroy(FolderTarget $folderTarget): RedirectResponse
    {
        $folderTarget->delete();

        return back()->with("success", "Targeting rule removed successfully");
    }

    private function validatePositionsBelongToCompanies(
        bool $allCompanies,
        bool $allPositions,
        array $companyIds,
        array $positionIds
    ): void
    {
        if ($allCompanies || $allPositions) {
            return;
        }

        $realCompanyIds = array_filter($companyIds);
        $realPositionIds = array_filter($positionIds);

        foreach ($realPositionIds as $positionId) {
            $assignedCompanyIds = JobPosition::findOrFail($positionId)
                ->companies()
                ->pluck("companies,id")
                ->toArray();
            foreach ($realCompanyIds as $companyId) {
                if (!in_array($companyId, $assignedCompanyIds)) {
                    $position = JobPosition::find($positionId);
                    $company = Company::find($companyId);
                    abort(422, "'{$position->name}' is not assgined to '{$company->name}'");
                }
            }
        }
    }

    private function buildCombinations(array $companyIds, array $positionIds): array
    {
        $combinations = [];

        foreach ($companyIds as $companyId) {
            foreach ($positionIds as $positionId) {
                $combinations[] = [
                    "company_id" => $companyId,
                    "job_position_id" => $positionId
                ];
            }
        }

        return $combinations;
    }
}
