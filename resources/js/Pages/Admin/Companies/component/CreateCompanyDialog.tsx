import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Field,
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLabel,
    FieldLegend,
    FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { COMPANY_THEMES } from "../Index";
import { UseFormReturn } from "@inertiajs/react";

type CreateCompanyDialogProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    form: UseFormReturn<{
        name: string;
        logo_path: File | null;
        header_theme: string;
    }>;
    onSubmit: (e: React.FormEvent) => void;
};

export default function CreateCompanyDialog({
    open,
    onOpenChange,
    form,
    onSubmit,
    onClose,
}: CreateCompanyDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogTrigger asChild>
                <Button size="lg">New Company</Button>
            </DialogTrigger>
            <DialogContent>
                <FieldSet className="">
                    <FieldLegend>New Company</FieldLegend>
                    <FieldDescription>
                        Provide the basic details of your company.
                    </FieldDescription>
                    <form onSubmit={onSubmit} className="space-y-4">
                        <FieldGroup>
                            <Field>
                                <FieldLabel htmlFor="name">
                                    Company Name
                                </FieldLabel>
                                <Input
                                    value={form.data.name}
                                    className=""
                                    autoComplete="off"
                                    onChange={(e) =>
                                        form.setData("name", e.target.value)
                                    }
                                    placeholder="Progressive Medical Corporation"
                                />
                                <FieldDescription>
                                    Enter the official name of your company.
                                </FieldDescription>
                                {form.errors.name && (
                                    <FieldError>{form.errors.name}</FieldError>
                                )}
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="username">
                                    Company Logo
                                </FieldLabel>
                                <Input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) =>
                                        form.setData(
                                            "logo_path",
                                            e.target.files?.[0] ?? null,
                                        )
                                    }
                                />
                            </Field>
                            <Field className="space-y-2">
                                <FieldLabel>Theme</FieldLabel>

                                <div className="flex gap-3">
                                    {Object.entries(COMPANY_THEMES).map(
                                        ([key, classes]) => (
                                            <button
                                                key={key}
                                                type="button"
                                                onClick={() =>
                                                    form.setData(
                                                        "header_theme",
                                                        key,
                                                    )
                                                }
                                                className={`h-12 w-12 rounded-full border transition ${classes}${
                                                    form.data.header_theme ===
                                                    key
                                                        ? "ring-2 ring-primary scale-120"
                                                        : ""
                                                }`}
                                            />
                                        ),
                                    )}
                                </div>
                                <FieldDescription>
                                    Choose a distinct color for your company
                                </FieldDescription>
                            </Field>
                        </FieldGroup>

                        <DialogFooter>
                            <Field
                                orientation="horizontal"
                                className="justify-end"
                            >
                                <Button
                                    size="lg"
                                    variant="outline"
                                    type="button"
                                    onClick={onClose}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    size="lg"
                                    type="submit"
                                    disabled={form.processing}
                                >
                                    {form.processing ? "Creating" : "Submit"}
                                </Button>
                            </Field>
                        </DialogFooter>
                    </form>
                </FieldSet>
            </DialogContent>
        </Dialog>
    );
}
