import type { Company } from "../Index";
import { COMPANY_THEMES } from "../Index";
import { UseFormReturn } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
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
    FieldGroup,
    FieldLabel,
    FieldLegend,
    FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
type CompanyForm = {
    name: string;
    logo_path: File | null;
    header_theme: string;
};
type EditCompanyDialogProps = {
    company: Company | null;
    form: UseFormReturn<CompanyForm>;
    onSubmit: (e: React.FormEvent) => void;
    onClose: () => void;
};
export default function EditCompanyDialog({
    company,
    form,
    onSubmit,
    onClose,
}: EditCompanyDialogProps) {
    const logoPreview = form.data.logo_path
        ? URL.createObjectURL(form.data.logo_path)
        : company?.logo_path
          ? `/storage/${company.logo_path}`
          : undefined;
    return (
        <Dialog
            open={!!company}
            onOpenChange={(open) => {
                if (!open) {
                    onClose();
                }
            }}
        >
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Company</DialogTitle>
                    <DialogDescription>
                        Edit company details and click save
                    </DialogDescription>
                </DialogHeader>
                <FieldSet>
                    <form onSubmit={onSubmit} className="space-y-4">
                        <FieldGroup>
                            <Field>
                                <FieldLabel>Company Name</FieldLabel>
                                <Input
                                    value={form.data.name}
                                    onChange={(e) =>
                                        form.setData("name", e.target.value)
                                    }
                                />
                                <FieldDescription>
                                    Change the name of the company
                                </FieldDescription>
                                {form.errors.name && (
                                    <p className="text-sm text-destructive">
                                        {form.errors.name}
                                    </p>
                                )}
                            </Field>
                            <Field>
                                <FieldLabel>Company Logo</FieldLabel>
                                <div className="flex items-center justify-between gap-4">
                                    <div className="flex items-center gap-2">
                                        {logoPreview && (
                                            <img
                                                src={logoPreview}
                                                className="h-12 w-12 rounded-full border object-cover"
                                            />
                                        )}

                                        {form.data.logo_path && (
                                            <p className="text-sm text-muted-foreground">
                                                {form.data.logo_path.name}
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-2 flex justify-end">
                                        <Input
                                            id="logo"
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={(e) =>
                                                form.setData(
                                                    "logo_path",
                                                    e.target.files?.[0] ?? null,
                                                )
                                            }
                                        />

                                        <Button
                                            type="button"
                                            size="sm"
                                            variant="secondary"
                                            onClick={() =>
                                                document
                                                    .getElementById("logo")
                                                    ?.click()
                                            }
                                        >
                                            Change Logo
                                        </Button>
                                    </div>
                                </div>
                            </Field>
                            <Field>
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
                                                        ? "ring-2 ring-primary scale-110"
                                                        : ""
                                                }`}
                                            />
                                        ),
                                    )}
                                </div>
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
                                    Save Changes
                                </Button>
                            </Field>
                        </DialogFooter>
                    </form>
                </FieldSet>
            </DialogContent>
        </Dialog>
    );
}
