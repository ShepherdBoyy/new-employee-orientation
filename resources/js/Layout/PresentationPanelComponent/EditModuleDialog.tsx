import { useEffect } from "react";
import { useForm } from "@inertiajs/react";
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
    FieldLabel,
    FieldGroup,
    FieldContent,
    FieldTitle,
} from "@/components/ui/field";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { MapPin, Building2, Layers } from "lucide-react";

type Props = {
    module: {
        id: number;
        name: string;
        slug: string;
        companySlug: string;
        employee_type: string;
    };
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

export default function EditModuleDialog({
    module,
    open,
    onOpenChange,
}: Props) {
    const form = useForm({
        name: module.name,
        employee_type: module.employee_type || "",
    });

    useEffect(() => {
        if (open) {
            form.setData({
                name: module.name,
                employee_type: module.employee_type || "",
            });
        }
    }, [open, module]);

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        const isCurrentlyViewing = window.location.pathname.includes(
            `/${module.slug}`,
        );

        form.transform((data) => ({
            ...data,
            isLinkActive: isCurrentlyViewing,
        }));

        form.put(`/admin/folders/${module.id}`, {
            preserveScroll: true,
            onSuccess: (page: any) => {
                onOpenChange(false);
                form.clearErrors();

                toast.success(page.props.success, {
                    position: "top-center",
                });
            },
        });
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Edit Module</DialogTitle>
                    <DialogDescription>
                        Edit module name and visibility settings.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <FieldGroup>
                        <Field>
                            <FieldLabel>Module Name</FieldLabel>
                            <Input
                                value={form.data.name}
                                onChange={(e) =>
                                    form.setData("name", e.target.value)
                                }
                                placeholder="e.g. Company Overview"
                            />
                        </Field>

                        <Field orientation="vertical">
                            <FieldLabel>Folder Visibility</FieldLabel>
                            <FieldDescription>
                                Update who can view this folder.
                            </FieldDescription>

                            <RadioGroup
                                value={form.data.employee_type}
                                onValueChange={(value) =>
                                    form.setData("employee_type", value)
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
                            onClick={() => onOpenChange(false)}
                        >
                            Cancel
                        </Button>

                        <Button type="submit" disabled={form.processing}>
                            {form.processing ? "Saving..." : "Save Changes"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
