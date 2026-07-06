import { useForm } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FieldDescription, FieldLegend, FieldSet } from "@/components/ui/field";
import CompanySelector from "./CompanySelector";

interface Company {
    id: number;
    name: string;
    slug: string;
    logo_path: string | null;
    status: "active" | "inactive";
    users_count?: number;
}

interface CompanyWithTypes extends Company {
    employee_types: { id: number; employee_type: "office" | "field" }[];
}

interface Props {
    companies: CompanyWithTypes[];
}

export default function AddJobPositionForm({ companies }: Props) {
    const form = useForm({
        company_ids: [] as number[],
        employee_type: "",
        name: "",
    });

    const selectedCompany = companies.filter((company) =>
        form.data.company_ids.includes(company.id),
    );

    function toggleCompany(companyId: number) {
        const exists = form.data.company_ids.includes(companyId);

        form.setData(
            "company_ids",
            exists
                ? form.data.company_ids.filter((id) => id !== companyId)
                : [...form.data.company_ids, companyId],
        );
    }

    /*   function handleCompanyChange(value: string) {
        form.setData({
            company_ids: value,
            employee_type: "",
            name: "",
        });
    } */

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        form.post("/admin/job-positions", {
            onSuccess: () => form.reset(),
        });
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="grid grid-cols-4 gap-3 items-end"
        >
            <div className="space-y-1">
                <FieldSet>
                    <FieldLegend>Add Job Position</FieldLegend>
                    <FieldDescription>
                        This appears on invoices and emails.
                    </FieldDescription>
                    <div className="space-y-1">
                        <Label>Position Name</Label>
                        <Input
                            value={form.data.name}
                            onChange={(e) =>
                                form.setData("name", e.target.value)
                            }
                            placeholder="e.g. Software Engineer"
                        />
                        {form.errors.name && (
                            <p className="text-xs text-red-500">
                                {form.errors.name}
                            </p>
                        )}
                    </div>

                    <CompanySelector
                        companies={companies}
                        selected={form.data.company_ids}
                        onChange={(ids) => form.setData("company_ids", ids)}
                    />
                </FieldSet>
                <Button type="submit" disabled={form.processing}>
                    {form.processing ? "Adding..." : "Add Position"}
                </Button>
            </div>
        </form>
    );
}
