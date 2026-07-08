import { useState } from "react";
import AddJobPositionForm from "./components/AddJobPositionForm";
import CompanyJobTabs from "./components/CompanyJobTabs";
import EditJobPositionDialog from "./components/EditJobPositionDialog";
import Master from "@/Layout/Master";
import type { JobPosition } from "../../Types/job-position";
import type { CompanyWithJobs } from "../../Types/company";

interface Props {
    companies: CompanyWithJobs[];
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
                    <CompanyJobTabs
                        companies={companies}
                        onEdit={setEditingPosition}
                    />
                </div>
            </Master>

            <EditJobPositionDialog
                position={editingPosition}
                companies={companies}
                onClose={() => setEditingPosition(null)}
            />
        </>
    );
}
