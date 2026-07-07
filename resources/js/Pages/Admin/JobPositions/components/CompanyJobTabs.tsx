import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Empty,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
    EmptyDescription,
    EmptyContent,
} from "@/components/ui/empty";
import { BrushCleaning } from "lucide-react";
import CreateCompanyDialog from "../../Companies/component/CreateCompanyDialog";

type Job = {
    id: number;
    name: string;
};

type Company = {
    id: number;
    name: string;
    slug: string;
    jobs?: Job[];
};

type Props = {
    companies: Company[];
};

export default function CompanyJobTabs({ companies }: Props) {
    if (!companies.length) return null;
    console.log(companies);
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
                            <div className="space-y-3">
                                {company.jobs?.length ? (
                                    company.jobs.map((job) => (
                                        <Card key={job.id} className="mt-4">
                                            <CardContent className="flex items-center justify-between p-3">
                                                <div>
                                                    <p className="font-medium">
                                                        {job.name}
                                                    </p>

                                                    <p className="text-sm text-muted-foreground">
                                                        Employee Position
                                                    </p>
                                                </div>

                                                {/* JobActions goes here later */}
                                            </CardContent>
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
