import { Company, COMPANY_THEMES } from "../Index";
import CompanyCardActions from "./CompanyCardActions";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

type CompanyCardProps = {
    company: Company;
    onEdit: (company: Company) => void;
    onDelete: (company: Company) => void;
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

                <img
                    src={`/storage/${company.logo_path}`}
                    alt={company.name}
                    className="absolute -bottom-8 right-6 h-16 w-16 rounded-full border-4 border-background object-cover bg-background z-10"
                />
            </div>
            <CardHeader>
                <CardContent className="pt-12">
                    <p className="text-sm text-muted-foreground">
                        New Employee Orientation
                    </p>
                </CardContent>
            </CardHeader>
            {/* Body */}
        </Card>
    );
}
