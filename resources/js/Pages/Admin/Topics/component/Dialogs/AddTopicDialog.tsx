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
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

export default function AddTopicDialog({ open, onOpenChange }: Props) {
    
    const form = useForm({
        name: "",
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        form.post("", {
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
                    <DialogTitle>Add Topic</DialogTitle>

                    <DialogDescription>
                        Create new topic for your module.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <FieldGroup>
                        <Field>
                            <FieldLabel>Topic</FieldLabel>

                            <Input
                                placeholder=""
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
                            disabled={form.processing || !form.data.name.trim()}
                        >
                            {form.processing ? "Adding..." : "Add Topic"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
