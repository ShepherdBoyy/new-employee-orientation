import { useForm } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
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
    FieldSeparator,
} from "@/components/ui/field";
import { BriefcaseBusiness } from "lucide-react";
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
import { JobPosition } from "@/Pages/Admin/Types/job-position";

interface Props {
    companies: Company[];
    jobs: JobPosition[];
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
                form.reset();
                toast.success(message.props.success, {
                    position: "top-center",
                });
            },
        });
    }

    function handleJob(value) {
        form.setData("job_ids", value);
    }

    return (
        <Card className="w-full overflow-hidden">
            <CardHeader className="border-b bg-muted/20">
                <div className="flex items-start gap-3">
                    <div>
                        <CardTitle className="text-base">
                            Assign Job Positions
                        </CardTitle>

                        <CardDescription className="mt-1">
                            Add one or more positions to selected companies.
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="">
                <form onSubmit={handleSubmit}>
                    <FieldGroup>
                        {/* Step 1 */}
                        <Field>
                            <FieldLabel>Job positions</FieldLabel>

                            <FieldDescription>
                                Select one or more positions to assign.
                            </FieldDescription>

                            <Combobox
                                multiple
                                autoHighlight
                                items={jobs}
                                itemToStringValue={(item) => String(item.id)}
                                onValueChange={handleJob}
                            >
                                <ComboboxChips ref={anchor} className="">
                                    <ComboboxValue>
                                        {(values: number[]) => (
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

                                                <ComboboxChipsInput
                                                    placeholder={
                                                        values.length
                                                            ? "Add another..."
                                                            : "Search positions..."
                                                    }
                                                />
                                            </>
                                        )}
                                    </ComboboxValue>
                                </ComboboxChips>

                                <ComboboxContent anchor={anchor}>
                                    <ComboboxEmpty>
                                        No positions found.
                                    </ComboboxEmpty>

                                    <ComboboxList>
                                        {(item) => (
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

                            {form.errors.job_ids && (
                                <FieldError>{form.errors.job_ids}</FieldError>
                            )}
                        </Field>

                        {/* Divider */}
                        <FieldSeparator />

                        {/* Step 2 */}
                        <Field>
                            <CompanySelector
                                companies={companies}
                                selected={form.data.company_ids}
                                onChange={(ids) =>
                                    form.setData("company_ids", ids)
                                }
                            />

                            {form.errors.company_ids && (
                                <FieldError>
                                    {form.errors.company_ids}
                                </FieldError>
                            )}
                        </Field>
                        {/* Summary */}
                        {(form.data.job_ids.length > 0 ||
                            form.data.company_ids.length > 0) && (
                            <div className="rounded-lg border bg-muted/30 p-3">
                                <div className="flex items-center justify-between gap-4">
                                    <div>
                                        <p className="text-sm font-medium">
                                            Assignment summary
                                        </p>

                                        <p className="mt-0.5 text-xs text-muted-foreground">
                                            {form.data.job_ids.length}{" "}
                                            {form.data.job_ids.length === 1
                                                ? "position"
                                                : "positions"}{" "}
                                            → {form.data.company_ids.length}{" "}
                                            {form.data.company_ids.length === 1
                                                ? "company"
                                                : "companies"}
                                        </p>
                                    </div>

                                    <span className="text-sm font-semibold">
                                        {form.data.job_ids.length *
                                            form.data.company_ids.length}
                                    </span>
                                </div>

                                <p className="mt-2 text-[11px] text-muted-foreground">
                                    Total assignments if all selected positions
                                    are assigned to all selected companies.
                                </p>
                            </div>
                        )}

                        {/* Submit */}
                        <Button
                            type="submit"
                            className="w-full"
                            disabled={
                                form.processing ||
                                form.data.company_ids.length === 0 ||
                                form.data.job_ids.length === 0
                            }
                        >
                            {form.processing
                                ? "Assigning..."
                                : "Assign Positions"}
                        </Button>
                    </FieldGroup>
                </form>
            </CardContent>
        </Card>
    );
}
