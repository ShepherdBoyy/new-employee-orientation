import { useState } from "react";
import { Head } from "@inertiajs/react";
import AddJobPositionForm from "./components/AddJobPositionForm";
import CompanyPositionsCard from "./components/CompanyPositionsCard";
import CompanyJobTabs from "./components/CompanyJobTabs";
import EditJobPositionDialog from "./components/EditJobPositionDialog";
import Master from "@/Layout/Master";

interface Company {
    id: number;
    name: string;
    slug: string;
    logo_path: string | null;
    status: "active" | "inactive";
    users_count?: number;
}

interface JobPosition {
    id: number;
    company_id: number;
    employee_type: "office" | "field";
    name: string;
}

interface CompanyEmployeeType {
    id: number;
    company_id: number;
    employee_type: "office" | "field";
}

interface CompanyWithData extends Company {
    employee_types: CompanyEmployeeType[];
    job_positions: JobPosition[];
}

interface Props {
    companies: CompanyWithData[];
}

export default function JobPositionsIndex({ companies }: Props) {
    const [editingPosition, setEditingPosition] = useState<JobPosition | null>(
        null,
    );

    return (
        <>
            <Master>
                <div className="grid lg:grid-cols-[420px_1fr] gap-3 items-start">
                    <AddJobPositionForm companies={companies} />
                    <CompanyJobTabs companies={companies} />
                </div>
            </Master>

            <EditJobPositionDialog
                position={editingPosition}
                onClose={() => setEditingPosition(null)}
            />
        </>
    );
}
