import { useEffect } from "react";
import { useForm } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription,
} from "@/components/ui/dialog";
import {
    FieldSet,
    FieldLegend,
    FieldDescription,
    Field,
    FieldLabel,
    FieldError,
} from "@/components/ui/field";
import CompanySelector from "./CompanySelector";
import type { Company } from "../../../Types/company";
import type { JobPosition } from "../../../Types/job-position";

interface EditJobPositionDialogProps {
    position: JobPosition | null;
    companies: Company[];
    onClose: () => void;
}

export default function EditJobPositionDialog({
    position,
    onClose,
    companies,
}: EditJobPositionDialogProps) {
    const form = useForm({ name: "", company_ids: [] as number[] });
    console.log(position);
    useEffect(() => {
        if (!position) return;

        form.setData({
            name: position.name,
            company_ids: [position.company_ids],
        });
    }, [position]);

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        form.put(`/admin/job-positions/${position?.id}`, {
            onSuccess: () => onClose(),
        });
    }

    return (
        <Dialog open={!!position} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Job Position</DialogTitle>
                    <DialogDescription>
                        Update the position name and assigned companies.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="max-w-md ">
                    <div className="space-y-1">
                        <FieldSet>
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

                        <Field className="">
                            <Button
                                disabled={
                                    !form.data.name.trim() ||
                                    form.data.company_ids.length === 0
                                }
                            >
                                Save Changes
                            </Button>
                        </Field>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={onClose}>
                            Cancel
                        </Button>

                        <Button>Save Changes</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
