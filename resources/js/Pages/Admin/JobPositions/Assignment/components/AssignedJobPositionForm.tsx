import { useForm } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner"
import * as React from "react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import {
    FieldDescription,
    Field,
    FieldLabel,
    FieldError,
    FieldGroup,
} from "@/components/ui/field";

import {
    Combobox,
    ComboboxChip,
    ComboboxChips,
    ComboboxChipsInput,
    ComboboxContent,
    ComboboxEmpty,
    ComboboxItem,
    ComboboxList,
    ComboboxValue,
    useComboboxAnchor,
} from "@/components/ui/combobox";

import CompanySelector from "./CompanySelector";
import type { Company } from "../../../Types/company";

interface Props {
    companies: Company[];
}

export default function AssignedJobPositionForm({ companies, jobs }: Props) {
    const form = useForm({
        company_ids: [] as number[],
        job_ids: [] as number[],
    });

    const anchor = useComboboxAnchor();

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        form.post("/admin/assign-jobs", {
            onSuccess: (message) => {
                form.reset()
                toast.success(message.props.success, { position: "top-center" });
            },
            
        });
    }

    function handleJob(value) {
        form.setData("job_ids", value);
    }

    return (
        <Card className="w-full h-full flex flex-col overflow-hidden">
            <CardHeader className="border-b bg-muted/20">
                <CardTitle>Assign Job Position</CardTitle>
                <CardDescription>
                    Select a job position and assign it to one or more
                    companies.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="max-w-md ">
                    <FieldGroup>
                        <Field className="mt-4">
                            <FieldLabel>Position Name</FieldLabel>
                            <FieldDescription>
                                Select 1 or more job positions
                            </FieldDescription>
                            <Combobox
                                multiple
                                autoHighlight
                                items={jobs}
                                itemToStringValue={(item) => String(item.id)}
                                onValueChange={(val) => handleJob(val)}
                                // val will now be an array of IDs: [1, 2, 3]
                            >
                                <ComboboxChips ref={anchor}>
                                    <ComboboxValue>
                                        {(
                                            values: number[], // 2. values is now an array of job IDs
                                        ) => (
                                            <>
                                                {values.map((id) => {
                                                    const job = jobs.find(
                                                        (j) => j.id === id,
                                                    );
                                                    if (!job) return null;

                                                    return (
                                                        <ComboboxChip
                                                            key={job.id}
                                                        >
                                                            {job.name}
                                                        </ComboboxChip>
                                                    );
                                                })}
                                                <ComboboxChipsInput />
                                            </>
                                        )}
                                    </ComboboxValue>
                                </ComboboxChips>

                                <ComboboxContent anchor={anchor}>
                                    <ComboboxEmpty>
                                        No items found.
                                    </ComboboxEmpty>
                                    <ComboboxList>
                                        {(item) => (
                                            /* 4. Pass the item's id as the primary value instead of the whole object */
                                            <ComboboxItem
                                                key={item.id}
                                                value={item.id}
                                            >
                                                {item.name}
                                            </ComboboxItem>
                                        )}
                                    </ComboboxList>
                                </ComboboxContent>
                            </Combobox>

                            <FieldError>{form.errors.name}</FieldError>
                        </Field>
                        <CompanySelector
                            companies={companies}
                            selected={form.data.company_ids}
                            onChange={(ids) => form.setData("company_ids", ids)}
                        />
                        <Field>
                            <Button
                                type="submit"
                                disabled={
                                    form.processing ||
                                    form.data.company_ids.length === 0
                                }
                            >
                                {form.processing ? "Adding..." : "Add Position"}
                            </Button>
                        </Field>
                    </FieldGroup>
                </form>
            </CardContent>
        </Card>
    );
}
