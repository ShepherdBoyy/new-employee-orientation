import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Empty,
    EmptyHeader,
    EmptyTitle,
    EmptyDescription,
} from "@/components/ui/empty";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import RemoveJobDialog from "./RemoveJobDialog";
import ViewJdDialog from "./ViewJdDialog";
import UploadJdDialog from "./UploadJdDialog";
import type { CompanyWithJobs } from "../../../Types/company";
import { Badge } from "@/components/ui/badge";
import { PinOff } from "lucide-react";
import { EllipsisVertical, Eye, Upload, RefreshCw } from "lucide-react";
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

    const activeDeletingCompanyName = companies.find(
        (c) => c.id === activeDeletingJob?.pivot.company_id,
    );
    const defaultTab = filteredCompanies[0]?.id
        ? String(filteredCompanies[0].id)
        : String(companies[0].id);

    const [activeCompanyId, setActiveCompanyId] = useState(defaultTab);

    const activeCompany = filteredCompanies.find(
        (company) => String(company.id) === activeCompanyId,
    );

    const activeJobs = activeCompany?.jobs ?? [];

    const totalJobs = activeJobs.length;

    const uploadedCount = activeJobs.filter((job) =>
        Boolean(job.document),
    ).length;

    const missingCount = totalJobs - uploadedCount;
    return (
        <>
            <Card className="w-full  flex flex-col ">
                <CardHeader className="border-b bg-muted/20">
                    <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                            <CardTitle className="text-base">
                                Assigned Job Positions
                            </CardTitle>

                            <p className="mt-1 text-sm text-muted-foreground">
                                Manage positions assigned to{" "}
                                {activeCompany?.name}.
                            </p>
                        </div>

                        <Badge variant="secondary" className="shrink-0">
                            {totalJobs}{" "}
                            {totalJobs === 1 ? "position" : "positions"}
                        </Badge>
                    </div>

                    <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1.5">
                            <span className="size-1.5 rounded-full bg-emerald-500" />
                            {uploadedCount} JD uploaded
                        </span>

                        {missingCount > 0 && (
                            <span className="flex items-center gap-1.5">
                                <span className="size-1.5 rounded-full bg-amber-500" />
                                {missingCount} need attention
                            </span>
                        )}
                    </div>
                </CardHeader>

                <CardContent>
                    <Tabs
                        value={activeCompanyId}
                        onValueChange={(value) => {
                            setActiveCompanyId(value);
                        }}
                        className="w-full space-y-2 pt-2"
                    >
                        {/* Horizontal Tab Track Container */}
                        <div className="w-full border-b overflow-x-auto scrollbar-none [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                            <TabsList className="bg-transparent p-0 gap-4 whitespace-nowrap min-w-max">
                                {filteredCompanies.map((company) => (
                                    <TabsTrigger
                                        key={company.id}
                                        value={String(company.id)}
                                        className=" rounded-none bg-transparent text-muted-foreground transition-all hover:text-foreground data-[state=active]:border-b-primary data-[state=active]:text-foreground data-[state=active]:shadow-none group"
                                    >
                                        <span>{company.name}</span>
                                    </TabsTrigger>
                                ))}
                            </TabsList>
                        </div>

                        <ScrollArea className="max-h-118 overflow-y-auto pr-2">
                            {filteredCompanies.map((company) => (
                                <TabsContent
                                    key={company.id}
                                    value={String(company.id)}
                                    className="mt-0 focus-visible:outline-none"
                                >
                                    {company.jobs?.length ? (
                                        <div className="overflow-hidden rounded-xl border">
                                            <div className="divide-y">
                                                {company.jobs.map((job) => (
                                                    <div
                                                        key={job.id}
                                                        className=" flex items-center justify-between gap-6 px-5 py-4 transition-colors hover:bg-muted/40"
                                                    >
                                                        {/* Job information */}
                                                        <div className="min-w-0 flex-1">
                                                            <div className="flex items-center ">
                                                                <p className="truncate text-sm font-medium">
                                                                    {job.name}
                                                                </p>
                                                            </div>

                                                            <div className="mt-2 flex items-center gap-2">
                                                                {job.document ? (
                                                                    <>
                                                                        <span className="size-1.5 rounded-full bg-emerald-500" />

                                                                        <span className="text-xs text-muted-foreground">
                                                                            Job
                                                                            description
                                                                            available
                                                                        </span>
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <span className="size-1.5 rounded-full bg-amber-500" />

                                                                        <span className="text-xs text-muted-foreground">
                                                                            Job
                                                                            description
                                                                            not
                                                                            uploaded
                                                                        </span>
                                                                    </>
                                                                )}
                                                            </div>
                                                        </div>

                                                        {/* Actions */}
                                                        <div className="flex shrink-0 items-center gap-1.5">
                                                            {job.document ? (
                                                                <Button
                                                                    size="sm"
                                                                    variant="secondary"
                                                                    className="gap-2"
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
                                                                >
                                                                    <Eye className="size-4" />
                                                                    View JD
                                                                </Button>
                                                            ) : (
                                                                <Button
                                                                    size="sm"
                                                                    className="gap-2"
                                                                    onClick={() => {
                                                                        setUploadDialog(
                                                                            true,
                                                                        );
                                                                        setActiveDeletingJob(
                                                                            job as unknown as JobWithPivot,
                                                                        );
                                                                    }}
                                                                >
                                                                    <Upload className="size-4" />
                                                                    Upload JD
                                                                </Button>
                                                            )}

                                                            <DropdownMenu>
                                                                <DropdownMenuTrigger
                                                                    asChild
                                                                >
                                                                    <Button
                                                                        size="icon"
                                                                        variant="ghost"
                                                                        className="size-8 text-muted-foreground hover:text-foreground"
                                                                    >
                                                                        <EllipsisVertical className="size-4" />
                                                                        <span className="sr-only">
                                                                            Actions
                                                                            for{" "}
                                                                            {
                                                                                job.name
                                                                            }
                                                                        </span>
                                                                    </Button>
                                                                </DropdownMenuTrigger>

                                                                <DropdownMenuContent
                                                                    align="end"
                                                                    className="w-56"
                                                                >
                                                                    {job.document ? (
                                                                        <DropdownMenuItem
                                                                            onClick={() => {
                                                                                setUploadDialog(
                                                                                    true,
                                                                                );
                                                                                setActiveDeletingJob(
                                                                                    job as unknown as JobWithPivot,
                                                                                );
                                                                            }}
                                                                        >
                                                                            <RefreshCw className="mr-2 size-4" />
                                                                            Replace
                                                                            JD
                                                                        </DropdownMenuItem>
                                                                    ) : (
                                                                        <DropdownMenuItem
                                                                            onClick={() => {
                                                                                setUploadDialog(
                                                                                    true,
                                                                                );
                                                                                setActiveDeletingJob(
                                                                                    job as unknown as JobWithPivot,
                                                                                );
                                                                            }}
                                                                        >
                                                                            <Upload className="mr-2 size-4" />
                                                                            Upload
                                                                            JD
                                                                        </DropdownMenuItem>
                                                                    )}

                                                                    <DropdownMenuSeparator />

                                                                    <DropdownMenuItem
                                                                        variant="destructive"
                                                                        className="text-destructive focus:text-destructive"
                                                                        onClick={() => {
                                                                            setActiveDeleteDialog(
                                                                                true,
                                                                            );
                                                                            setActiveDeletingJob(
                                                                                job as unknown as JobWithPivot,
                                                                            );
                                                                        }}
                                                                    >
                                                                        <PinOff className="mr-2 size-4" />
                                                                        Remove
                                                                        assignment
                                                                    </DropdownMenuItem>
                                                                </DropdownMenuContent>
                                                            </DropdownMenu>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ) : (
                                        <Empty className="border border-dashed bg-muted/5 rounded-xl py-12">
                                            <EmptyHeader>
                                                <EmptyTitle className="text-base font-medium text-muted-foreground">
                                                    No active assignments
                                                </EmptyTitle>
                                                <EmptyDescription className="text-xs max-w-60 mx-auto mt-1">
                                                    Use your assignment form to
                                                    map roles to this profile.
                                                </EmptyDescription>
                                            </EmptyHeader>
                                        </Empty>
                                    )}
                                </TabsContent>
                            ))}
                        </ScrollArea>
                    </Tabs>
                </CardContent>
            </Card>

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
