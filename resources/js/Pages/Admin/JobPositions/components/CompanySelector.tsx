import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Field,
    FieldContent,
    FieldDescription,
    FieldLabel,
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
    const allCompanyIds = companies.map((company) => company.id);

    const allSelected =
        companies.length > 0 && selected.length === companies.length;

    const someSelected = selected.length > 0 && !allSelected;
    function toggleAll() {
        if (allSelected) {
            onChange([]);
        } else {
            onChange(allCompanyIds);
        }
    }
    function toggle(companyId: number) {
        const exists = selected.includes(companyId);

        onChange(
            exists
                ? selected.filter((id) => id !== companyId)
                : [...selected, companyId],
        );
    }

    return (
        <Field orientation="vertical" className="w-full ">
            <FieldLabel>Select Companies</FieldLabel>
            <FieldDescription>
                Assign this position to one or more companies.
            </FieldDescription>
            <FieldLabel className="p-2">
                <Field orientation="horizontal">
                    <FieldContent>
                        <FieldTitle>Select All Companies</FieldTitle>
                        <FieldDescription>
                            {selected.length} of {companies.length} companies
                            selected.
                        </FieldDescription>
                    </FieldContent>

                    <Checkbox
                        checked={allSelected}
                        onCheckedChange={toggleAll}
                    />
                </Field>
            </FieldLabel>

            {companies.map((company) => (
                <FieldLabel key={company.id} className="p-2">
                    <Field orientation="horizontal">
                        <FieldContent>
                            <div className="flex items-center gap-3">
                                <Avatar className="h-10 w-10">
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
