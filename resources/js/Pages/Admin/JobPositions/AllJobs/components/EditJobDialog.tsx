import { useEffect } from "react";
import { useForm } from "@inertiajs/react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import {
    Field,
    FieldDescription,
    FieldError,
    FieldLabel,
} from "@/components/ui/field";
import { JobPosition } from "@/Pages/Admin/Types/job-position";

type Props = {
    job: JobPosition | null;
    onClose: () => void;
};
export default function EditJobDialog({ onClose, job }: Props) {
    const form = useForm({ name: "" });
    useEffect(() => {
        if (!job) return;

        form.setData("name", job.name);
    }, [job]);
    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        if (!job) return;

        form.put(`/admin/jobs/${job.id}`, {
            onSuccess: () => {
                form.reset();
                onClose();
            },
        });
    }
    return (
        <>
            <Dialog
                open={!!job}
                onOpenChange={(open) => {
                    if (!open) onClose();
                }}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Job Position</DialogTitle>
                        <DialogDescription>
                            Update the job position name.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <Field>
                            <FieldLabel>Job Name</FieldLabel>

                            <Input
                                value={form.data.name}
                                onChange={(e) =>
                                    form.setData("name", e.target.value)
                                }
                            />

                            <FieldError>{form.errors.name}</FieldError>

                            <FieldDescription>
                                This name will appear wherever this job position
                                is assigned.
                            </FieldDescription>
                        </Field>

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={onClose}
                            >
                                Cancel
                            </Button>

                            <Button
                                type="submit"
                                disabled={
                                    form.processing || !form.data.name.trim()
                                }
                            >
                                Save Changes
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
}
