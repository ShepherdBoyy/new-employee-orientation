import { useState } from "react";
import AddJobPositionForm from "./components/AddJobPositionForm";
import CompanyJobTabs from "./components/CompanyJobTabs";
import Master from "@/Layout/Master";
import type { JobPosition } from "../../Types/job-position";
import type { CompanyWithJobs } from "../../Types/company";
import RemoveJobDialog from "./components/RemoveJobDialog";
import { router } from "@inertiajs/react";

interface Props {
    companies: CompanyWithJobs[];
    jobs: JobPosition;
}

export default function JobPositionsIndex({ companies, jobs }: Props) {
    return (
        <>
            <Master>
                <div className="grid lg:grid-cols-[420px_1fr] gap-3 items-start">
                    <AddJobPositionForm companies={companies} jobs={jobs} />
                    <CompanyJobTabs companies={companies} />
                </div>
            </Master>

            {/* <EditJobPositionDialog
                position={editingPosition}
                companies={companies}
                onClose={() => setEditingPosition(null)}
            /> */}
        </>
    );
}
