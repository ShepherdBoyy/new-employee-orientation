import CompanyCardActions from "./CompanyCardActions";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { CompanyWithJobCount } from "../../Types/company";
import { COMPANY_THEMES } from "../../Types/company";

type CompanyCardProps = {
    company: CompanyWithJobCount;
    onEdit: (company: CompanyWithJobCount) => void;
    onDelete: (company: CompanyWithJobCount) => void;
};

export default function CompanyCard({
    company,
    onEdit,
    onDelete,
}: CompanyCardProps) {
    return (
        <Card className="">
            {/* Header Area */}
            <div
                className={`relative h-32 border-b ${COMPANY_THEMES[company.header_theme]}`}
            >
                <div className="absolute top-1 right-2 z-10">
                    <CompanyCardActions
                        company={company}
                        onEdit={onEdit}
                        onDelete={onDelete}
                    />
                </div>

                <div className="absolute bottom-4 left-6 z-10">
                    <h2 className="text-xl font-bold text-white">
                        {company.name}
                    </h2>
                </div>

                <Avatar className="absolute -bottom-8 right-6 h-16 w-16 rounded-full border-4 border-background object-cover bg-background z-10">
                    <AvatarImage src={`/storage/${company.logo_path}`} />
                    <AvatarFallback> {company.name[0]}</AvatarFallback>
                </Avatar>
            </div>
            <CardHeader>
                <CardContent className="pt-12">
                    <p className="text-sm text-muted-foreground">
                        {company.jobs_count}{" "}
                        {company.jobs_count === 1
                            ? "Job Position"
                            : "Job Positions"}
                    </p>
                </CardContent>
            </CardHeader>
            {/* Body */}
        </Card>
    );
}
