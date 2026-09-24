<?php

namespace App\Exports;

use App\Models\User;
use Illuminate\Support\Carbon;
use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class EmployeesExport implements FromCollection, WithHeadings, WithMapping
{
    public function collection(): Collection
    {
        return User::where("role", "employee")
            ->with(["company", "jobPosition"])
            ->orderBy("name")
            ->get();
    }

    public function headings(): array
    {
        return [
            "Name",
            "Email",
            "Company",
            "Job Position",
            "Welcome Viewed At",
            "JD Viewed At",
            "Progress",
            "Status",
            "Created At",
            "Expires At"
        ];
    }

    public function map($employee): array
    {
        $totalFolders = $employee->company
            ? $employee->company->foldersForEmployee($employee)->count()
            : 0;

        $completedFolders = $employee->folderCompletions()->count();

        return [
            $employee->name,
            $employee->email,
            $employee->company?->name,
            $employee->jobPosition?->name,
            $this->formatDate($employee->welcome_viewed_at),
            $this->formatDate($employee->jd_viewed_at),
            "{$completedFolders}/{$totalFolders}",
            $this->statusLabel($employee),
            $this->formatDate($employee->created_at),
            $this->formatDate($employee->expires_at),
        ];
    }

    private function statusLabel(User $employee): string
    {
        return match (true) {
            $employee->hasAcknowledgedOrientation() => "Acknowledged",
            $employee->folderCompletions()->count() > 0 => "Ongoing",
            default => "Not Started"
        };
    }

    private function formatDate(?Carbon $date): ?string
    {
        return $date?->format("M j, Y");
    }
}