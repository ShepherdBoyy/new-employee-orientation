import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Empty,
    EmptyHeader,
    EmptyTitle,
    EmptyDescription,
} from "@/components/ui/empty";

// 1. Import your fixed RemoveJobDialog component
import RemoveJobDialog from "./RemoveJobDialog";
import ViewJdDialog from "./ViewJdDialog";
import UploadJdDialog from "./UploadJdDialog";

import type { CompanyWithJobs } from "../../../Types/company";
import { Badge } from "@/components/ui/badge";
import { PinOff, BriefcaseBusiness } from "lucide-react";
import { router } from "@inertiajs/react";

// Match the type expected by the Dialog component
interface JobWithPivot {
    id: number;
    name: string;
    pivot: {
        company_id: number;
        name: string;
        [key: string]: any;
    };
}

type Props = {
    companies: CompanyWithJobs[];
};

export default function CompanyJobTabs({ companies }: Props) {
    const [activeDeletingJob, setActiveDeletingJob] =
        useState<JobWithPivot | null>(null);

    const [uploadDialog, setUploadDialog] = useState(false);
    const [viewDialog, setViewDialog] = useState(false);
    const [document, setDocument] = useState("");
    const [activeDeleteDialog, setActiveDeleteDialog] = useState(false);

    if (!companies.length) return null;

    const filteredCompanies = companies.filter((company) =>
        company.name.toLowerCase(),
    );

    const defaultTab = filteredCompanies[0]?.id
        ? String(filteredCompanies[0].id)
        : String(companies[0].id);

    const activeDeletingCompanyName = companies.find(
        (c) => c.id === activeDeletingJob?.pivot.company_id,
    );

    return (
        <>
            <Card className="w-full h-full flex flex-col overflow-hidden">
                <CardHeader className="border-b bg-muted/20">
                    <CardTitle>Job Management Matrix</CardTitle>
                    <CardDescription>
                        Review and detach active job positions across your
                        companies.
                    </CardDescription>
                </CardHeader>

                <CardContent className="p-6">
                    <Tabs
                        defaultValue={defaultTab}
                        className="w-full space-y-6"
                    >
                        {/* Horizontal Tab Track Container */}
                        <div className="w-full border-b overflow-x-auto scrollbar-none [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                            <TabsList
                                variant="line"
                                className="bg-transparent p-0 gap-4 whitespace-nowrap min-w-max"
                            >
                                {filteredCompanies.map((company) => (
                                    <TabsTrigger
                                        key={company.id}
                                        value={String(company.id)}
                                        className=" rounded-none bg-transparent text-muted-foreground transition-all hover:text-foreground data-[state=active]:border-b-primary data-[state=active]:text-foreground data-[state=active]:shadow-none group"
                                    >
                                        <span>{company.name}</span>
                                        <Badge className=" bg-muted  text-xs font-semibold text-muted-foreground group-data-[state=active]:bg-primary/10 group-data-[state=active]:text-primary transition-colors">
                                            {company.jobs?.length || 0}
                                        </Badge>
                                    </TabsTrigger>
                                ))}
                            </TabsList>
                        </div>

                        {/* Main Content Grid Area */}
                        {filteredCompanies.map((company) => (
                            <TabsContent
                                key={company.id}
                                value={String(company.id)}
                                className="mt-0 focus-visible:outline-none"
                            >
                                {company.jobs?.length ? (
                                    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-2">
                                        {company.jobs.map((job) => (
                                            <Card
                                                key={job.id}
                                                className="shadow-sm hover:shadow-md transition-all border-muted/60 flex flex-col justify-between"
                                            >
                                                <CardContent className="flex items-center justify-between">
                                                    <h4 className="font-semibold text-sm text-foreground tracking-tight truncate">
                                                        {job.name}
                                                    </h4>

                                                    <div className="grid gap-2 sm:grid-cols-2">
                                                        {job.document ? (
                                                            <Button
                                                                size="sm"
                                                                onClick={() => {
                                                                    setViewDialog(
                                                                        true,
                                                                    );
                                                                    setDocument(
                                                                        job
                                                                            .document
                                                                            .file_path,
                                                                    );
                                                                }}
                                                                variant="outline"
                                                            >
                                                                <BriefcaseBusiness />
                                                                View JD
                                                            </Button>
                                                        ) : (
                                                            <Button
                                                                size="sm"
                                                                onClick={() => {
                                                                    setUploadDialog(
                                                                        true,
                                                                    );
                                                                    setActiveDeletingJob(
                                                                        job as unknown as JobWithPivot,
                                                                    );
                                                                }}
                                                                variant="outline"
                                                            >
                                                                <BriefcaseBusiness />
                                                                Upload JD
                                                            </Button>
                                                        )}
                                                        <Button
                                                            size="sm"
                                                            onClick={() => {
                                                                setActiveDeleteDialog(
                                                                    true,
                                                                );
                                                                setActiveDeletingJob(
                                                                    job as unknown as JobWithPivot,
                                                                );
                                                            }}
                                                            variant="outline"
                                                        >
                                                            <PinOff />
                                                            Remove
                                                        </Button>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                ) : (
                                    <Empty className="border border-dashed bg-muted/5 rounded-xl py-12">
                                        <EmptyHeader>
                                            <EmptyTitle className="text-base font-medium text-muted-foreground">
                                                No active assignments
                                            </EmptyTitle>
                                            <EmptyDescription className="text-xs max-w-60 mx-auto mt-1">
                                                Use your assignment form to map
                                                roles to this profile.
                                            </EmptyDescription>
                                        </EmptyHeader>
                                    </Empty>
                                )}
                            </TabsContent>
                        ))}
                    </Tabs>
                </CardContent>
            </Card>

            {/* 5. Render the AlertDialog globally at the root layout level */}
            <RemoveJobDialog
                job={activeDeletingJob}
                companyName={activeDeletingCompanyName?.name}
                isOpen={activeDeleteDialog}
                onClose={() => setActiveDeleteDialog(false)} // Clear state to shut down the dialog
            />

            <ViewJdDialog
                isOpen={viewDialog}
                onClose={() => setViewDialog(false)}
                document={document}
            />

            <UploadJdDialog
                companyJobIds={activeDeletingJob?.pivot}
                isOpen={uploadDialog}
                onClose={() => setUploadDialog(false)}
            />
        </>
    );
}
