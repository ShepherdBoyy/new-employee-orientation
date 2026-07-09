import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Empty,
    EmptyHeader,
    EmptyTitle,
    EmptyDescription,
    EmptyContent,
} from "@/components/ui/empty";
import type { CompanyWithJobs } from "../../../Types/company";
import type { JobPosition } from "../../../Types/job-position";

type Props = {
    companies: CompanyWithJobs[];
    onClose: (job: JobPosition) => void;
};

export default function CompanyJobTabs({ companies, onClose }: Props) {
    if (!companies.length) return null;
    return (
        <Card className="">
            <CardHeader className="">
                <CardTitle>Job Position</CardTitle>
                <CardDescription>
                    Browse and manage job positions by company.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue={String(companies[0].id)}>
                    <TabsList
                        variant="line"
                        className="h-auto w-full justify-start rounded-none bg-transparent p-0"
                    >
                        {companies.map((company) => (
                            <TabsTrigger
                                key={company.id}
                                value={String(company.id)}
                            >
                                {company.name}
                            </TabsTrigger>
                        ))}
                    </TabsList>

                    {companies.map((company) => (
                        <TabsContent
                            key={company.id}
                            value={String(company.id)}
                        >
                            <div className="space-y-2">
                                {company.jobs?.length ? (
                                    company.jobs.map((job) => (
                                        <Card key={job.id} className="mt-4">
                                            <CardHeader>
                                                <CardTitle>
                                                    {job.name}
                                                </CardTitle>
                                                <CardDescription>
                                                    <p className="text-sm text-muted-foreground">
                                                        Employee Position
                                                    </p>
                                                </CardDescription>

                                                <Button
                                                    variant="secondary"
                                                    size="sm"
                                                    onClick={() => onClose(job)}
                                                >
                                                    Remove
                                                </Button>
                                            </CardHeader>
                                        </Card>
                                    ))
                                ) : (
                                    <Empty className="mt-4">
                                        <EmptyHeader>
                                            <EmptyTitle className="text-xl">
                                                No job positions found
                                            </EmptyTitle>
                                            <EmptyDescription>
                                                Create a job position using the
                                                form on the left.
                                            </EmptyDescription>
                                        </EmptyHeader>
                                        <EmptyContent></EmptyContent>
                                    </Empty>
                                )}
                            </div>
                        </TabsContent>
                    ))}
                </Tabs>
            </CardContent>
        </Card>
    );
}
