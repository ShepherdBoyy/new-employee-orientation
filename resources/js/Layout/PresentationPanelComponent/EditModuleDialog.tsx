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
    FieldLabel,
    FieldGroup,
} from "@/components/ui/field";

type Props = {
    module: {
        id: number,
        name: string,
        slug: string
        companySlug: string
    }
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

export default function EditModuleDialog({ module, open, onOpenChange }: Props) {
    
    const form = useForm({
        name: "",
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        const currentPath = window.location.pathname;
        const itemPath = `/admin/folders/${module.companySlug}/${module.slug}/`;
        const isCurrentlyViewing = currentPath === itemPath;

        form.transform((data) => ({
            ...data,
            isLinkActive: isCurrentlyViewing,
        }));

        // 2. Then execute the put request normally
        form.put(`/admin/folders/${module.id}`, {
            preserveScroll: true,
            onSuccess: (page) => {
                form.reset();
                onOpenChange(false);
                toast.success(page.props.success, {
                    position: "top-center",
                });
            },
        });
    }
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Module</DialogTitle>

                    <DialogDescription>
                        Edit module for your job.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <FieldGroup>
                        <Field>
                            <FieldLabel>Module</FieldLabel>

                            <Input
                                placeholder={module.name}
                                value={form.data.name}
                                onChange={(e) =>
                                    form.setData("name", e.target.value)
                                }
                            />
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
                        >
                            {form.processing ? "Editing..." : "Edit Module"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
