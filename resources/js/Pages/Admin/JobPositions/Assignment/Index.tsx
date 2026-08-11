import AssignedJobPositionForm from "./components/AssignedJobPositionForm";
import CompanyJobTabs from "./components/CompanyJobTabs";
import Master from "@/Layout/Master";
import type { JobPosition } from "../../Types/job-position";
import type { CompanyWithJobs } from "../../Types/company";
import { Separator } from "@/components/ui/separator";

interface Props {
    companies: CompanyWithJobs[];
    jobs: JobPosition;
}

function Index({ companies, jobs }: Props) {
    return (
        <>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">
                            Job Assignment
                        </h1>
                        <p className="text-sm text-muted-foreground mt-1">
                            Assign job positions to companies and manage their
                            job descriptions.
                        </p>
                    </div>
                </div>
                <Separator />
                <div className="grid lg:grid-cols-[380px_minmax(0,1fr)] gap-6 items-start">
                    <AssignedJobPositionForm
                        companies={companies}
                        jobs={jobs}
                    />
                    <CompanyJobTabs companies={companies} />
                </div>
            </div>
        </>
    );
}

Index.layout = (page: React.ReactNode) => <Master>{page}</Master>;
export default Index;
