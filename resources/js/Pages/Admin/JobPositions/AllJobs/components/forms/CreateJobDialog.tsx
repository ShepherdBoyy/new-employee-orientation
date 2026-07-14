import { useForm } from "@inertiajs/react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner"
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

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

export default function CreateJobDialog({ open, onOpenChange }: Props) {
    const form = useForm({
        name: "",
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        form.post("/admin/job-positions", {
            preserveScroll: true,

            onSuccess: (message) => {
                form.reset();
                onOpenChange(false);
                toast.success(message.props.success, { position: "top-center" });
            },
        });
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create Job Position</DialogTitle>

                    <DialogDescription>
                        Create a reusable job position. You can assign it to
                        companies later from the Job Assignment page.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <Field>
                        <FieldLabel>Job Position</FieldLabel>

                        <Input
                            placeholder="e.g. Software Engineer"
                            value={form.data.name}
                            onChange={(e) =>
                                form.setData("name", e.target.value)
                            }
                        />

                        <FieldDescription>
                            This will become available when assigning jobs to
                            companies.
                        </FieldDescription>

                        <FieldError>{form.errors.name}</FieldError>
                    </Field>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                        >
                            Cancel
                        </Button>

                        <Button
                            type="submit"
                            disabled={form.processing || !form.data.name.trim()}
                        >
                            {form.processing ? "Creating..." : "Create Job"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
