import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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

    return (
        <Tabs defaultValue={companies[0].slug} className="w-full">
            <TabsList>
                {companies.map((company) => (
                    <TabsTrigger key={company.id} value={String(company.id)}>
                        {company.name}
                    </TabsTrigger>
                ))}
            </TabsList>

            {companies.map((company) => (
                <TabsContent key={company.id} value={String(company.id)}>
                    <div className="space-y-2">
                        {company.jobs?.length ? (
                            company.jobs.map((job) => (
                                <div
                                    key={job.id}
                                    className="
                                        rounded-md
                                        border
                                        p-3
                                    "
                                >
                                    {job.name}
                                </div>
                            ))
                        ) : (
                            <p className="text-muted-foreground">
                                No job positions yet.
                            </p>
                        )}
                    </div>
                </TabsContent>
            ))}
        </Tabs>
    );
}
