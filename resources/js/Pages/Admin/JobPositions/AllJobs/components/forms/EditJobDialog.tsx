import { useEffect } from "react";
import { useForm } from "@inertiajs/react";
import { MapPin, Building2 } from "lucide-react";
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

import { toast } from "sonner"

import {
    Field,
    FieldDescription,
    FieldError,
    FieldLabel,
    FieldGroup,
    FieldContent,
    FieldTitle,
} from "@/components/ui/field";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import { JobPosition } from "@/Pages/Admin/Types/job-position";

type Props = {
    job: JobPosition | null;
    onClose: () => void;
};
export default function EditJobDialog({ onClose, job }: Props) {
    const form = useForm({ name: "", type:null });
    useEffect(() => {
        if (!job) return;

        form.setData("name", job.name);
        form.setData("type", job.type);
    }, [job]);
    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        if (!job) return;

        form.put(`/admin/job-positions/${job.id}`, {
            onSuccess: (message) => {
                onClose();
                toast.success(message.props.success, { position: "top-center" });
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

                            <RadioGroup 
                                value={form.data.type} 
                                onValueChange={(value) => form.setData('type', value)}
                            >
                                {/* Field-Based Option */}
                                <FieldLabel>
                                    <Field orientation="horizontal">
                                        <MapPin className="h-5 w-5 text-muted-foreground" />
                                        <FieldContent>
                                            <FieldTitle>Field-Based</FieldTitle>
                                            <FieldDescription>
                                                Requires working on-site,
                                                traveling, or visiting client
                                                locations outdoors.
                                            </FieldDescription>
                                        </FieldContent>
                                        <RadioGroupItem value="field_based" />
                                    </Field>
                                </FieldLabel>

                                {/* Non-Field Option */}
                                <FieldLabel>
                                    <Field orientation="horizontal">
                                        <Building2 className="h-5 w-5 text-muted-foreground" />
                                        <FieldContent>
                                            <FieldTitle>
                                                Non Field-Based
                                            </FieldTitle>
                                            <FieldDescription>
                                                Stationary work performed
                                                primarily indoors from an office
                                                or desk setting.
                                            </FieldDescription>
                                        </FieldContent>
                                        <RadioGroupItem value="non_field" />
                                    </Field>
                                </FieldLabel>
                            </RadioGroup>

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
