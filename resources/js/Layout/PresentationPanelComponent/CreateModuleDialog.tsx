import { useEffect } from "react";
import { useForm } from "@inertiajs/react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
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
import { MapPin, Building2, Layers } from "lucide-react";

interface Props {
    open: boolean;
    onClose: () => void;
    companyId: number;
}

export default function CreateFolderDialog({
    open,
    onClose,
    companyId,
}: Props) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: "",
        company_id: companyId,
        employee_type: "",
    });

    useEffect(() => {
        if (open) {
            reset();
            setData("company_id", companyId);
        }
    }, [open]);

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        post("/admin/folders", {
            onSuccess: (message: any) => {
                reset();
                onClose();
                toast.success(message.props.success, {
                    position: "top-center",
                });
            },
        });
    }

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Create Folder</DialogTitle>
                    <DialogDescription>
                        Give this module a clear, descriptive name and select
                        who can view it.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <FieldGroup>
                        <Field>
                            <FieldLabel>Folder Name</FieldLabel>

                            <Input
                                id="name"
                                value={data.name}
                                onChange={(e) =>
                                    setData("name", e.target.value)
                                }
                                placeholder="e.g. Company Overview"
                                autoFocus
                            />
                        </Field>

                        <FieldError>
                            {errors.name && (
                                <p className="text-sm text-destructive">
                                    {errors.name}
                                </p>
                            )}
                        </FieldError>

                        <Field orientation="vertical">
                            <FieldLabel>Folder Visibility</FieldLabel>
                            <FieldDescription>
                                Select the primary workplace environment to
                                control who can view this folder.
                            </FieldDescription>

                            <RadioGroup
                                value={data.employee_type}
                                onValueChange={(value) =>
                                    setData("employee_type", value)
                                }
                            >
                                {/* Both Option */}
                                <FieldLabel>
                                    <Field orientation="horizontal">
                                        <Layers className="h-5 w-5 text-muted-foreground" />
                                        <FieldContent>
                                            <FieldTitle>Both</FieldTitle>
                                            <FieldDescription>
                                                Folders will appear for both
                                                employee types.
                                            </FieldDescription>
                                        </FieldContent>
                                        <RadioGroupItem value="both" />
                                    </Field>
                                </FieldLabel>

                                {/* Field-Based Option */}
                                <FieldLabel>
                                    <Field orientation="horizontal">
                                        <MapPin className="h-5 w-5 text-muted-foreground" />
                                        <FieldContent>
                                            <FieldTitle>Field-Based</FieldTitle>
                                            <FieldDescription>
                                                Folder will appear only for
                                                field-based employees.
                                            </FieldDescription>
                                        </FieldContent>
                                        <RadioGroupItem value="field" />
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
                                                Folder will appear only for
                                                non-field based employees.
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
                            onClick={onClose}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {processing ? "Creating..." : "Create Folder"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
