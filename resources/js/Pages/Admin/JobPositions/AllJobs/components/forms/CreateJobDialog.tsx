import { useForm } from "@inertiajs/react";
import { MapPin, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
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
    FieldGroup,
    FieldContent,
    FieldTitle,
} from "@/components/ui/field";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

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
                toast.success(message.props.success, {
                    position: "top-center",
                });
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
                    <FieldGroup>
                        <Field>
                            <FieldLabel>Job Position</FieldLabel>

                            <Input
                                placeholder="e.g. Software Engineer"
                                value={form.data.name}
                                onChange={(e) =>
                                    form.setData("name", e.target.value)
                                }
                            />
                        </Field>
                        <Field orientation="vertical">
                            <FieldLabel>Choose Job Type</FieldLabel>
                            <FieldDescription>
                                Select the primary workplace environment for
                                this role.
                            </FieldDescription>

                            <RadioGroup>
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
                                                Desk / Office-Based
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
                        </Field>
                    </FieldGroup>

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
