import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Field,
    FieldContent,
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLabel,
    FieldLegend,
    FieldSet,
    FieldTitle,
} from "@/components/ui/field";
import { Checkbox } from "@/components/ui/checkbox";

interface Company {
    id: number;
    name: string;
    slug: string;
    logo_path: string | null;
    status: "active" | "inactive";
    users_count?: number;
}

interface CompanySelectorProps {
    companies: Company[];
    selected: number[];
    onChange: (companyIds: number[]) => void;
}

export default function CompanySelector({
    companies,
    selected,
    onChange,
}: CompanySelectorProps) {
    function toggle(companyId: number) {
        const exists = selected.includes(companyId);

        onChange(
            exists
                ? selected.filter((id) => id !== companyId)
                : [...selected, companyId],
        );
    }

    return (
        <Field orientation="vertical" className="w-full">
            <FieldLabel>Select Companies</FieldLabel>
            <FieldDescription>
                Assign this position to one or more companies.
            </FieldDescription>
            {companies.map((company) => (
                <FieldLabel
                    key={company.id}
                    className="
                        rounded-lg
                        border
                        p-3
                        hover:bg-muted/50
                        cursor-pointer
                    "
                >
                    <Field orientation="horizontal">
                        <FieldContent>
                            <div className="flex items-center gap-3">
                                <Avatar>
                                    <AvatarImage
                                        src={`/storage/${company.logo_path}`}
                                    />
                                    <AvatarFallback>
                                        {company.name[0]}
                                    </AvatarFallback>
                                </Avatar>

                                <div>
                                    <FieldTitle>{company.name}</FieldTitle>
                                </div>
                            </div>
                        </FieldContent>

                        <Checkbox
                            checked={selected.includes(company.id)}
                            onCheckedChange={() => toggle(company.id)}
                        />
                    </Field>
                </FieldLabel>
            ))}
        </Field>
    );
}
