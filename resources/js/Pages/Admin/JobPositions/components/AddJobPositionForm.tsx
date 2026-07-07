import { useForm } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
    FieldDescription,
    FieldLegend,
    FieldSet,
    Field,
    FieldLabel,
    FieldError,
    FieldSeparator,
} from "@/components/ui/field";
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
        name: "",
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        form.post("/admin/job-positions", {
            onSuccess: () => form.reset(),
        });
    }

    return (
        <Card>
            <CardContent>
                <form onSubmit={handleSubmit} className="max-w-md ">
                    <div className="space-y-1">
                        <FieldSet>
                            <FieldLegend>New Job Position</FieldLegend>
                            <FieldDescription>
                                Create a reusable job position and assign it to
                                one or more companies.
                            </FieldDescription>
                            <Field className="space-y-1">
                                <FieldLabel>Position Name</FieldLabel>
                                <Input
                                    value={form.data.name}
                                    onChange={(e) =>
                                        form.setData("name", e.target.value)
                                    }
                                    placeholder="e.g. Software Engineer"
                                />

                                <FieldError>{form.errors.name}</FieldError>
                            </Field>
                            <CompanySelector
                                companies={companies}
                                selected={form.data.company_ids}
                                onChange={(ids) =>
                                    form.setData("company_ids", ids)
                                }
                            />
                        </FieldSet>

                        <Field className="mt-4">
                            <Button
                                type="submit"
                                disabled={
                                    form.processing ||
                                    !form.data.name.trim() ||
                                    form.data.company_ids.length === 0
                                }
                            >
                                {form.processing ? "Adding..." : "Add Position"}
                            </Button>
                        </Field>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
