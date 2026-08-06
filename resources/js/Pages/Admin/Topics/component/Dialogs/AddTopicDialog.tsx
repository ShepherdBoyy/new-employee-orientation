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
import { Field, FieldLabel, FieldGroup } from "@/components/ui/field";

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    folderId: number
};

export default function AddTopicDialog({ open, onOpenChange, folderId }: Props) {
    const { data, setData, post, processing, errors, reset } = useForm({
        label: ""
    })

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        post(`/admin/folders/${folderId}/topics`, {
            preserveScroll: true,

            onSuccess: (message) => {
                reset();
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
                                value={data.label}
                                onChange={(e) =>
                                    setData("label", e.target.value)
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
                            disabled={processing || !data.label.trim()}
                        >
                            {processing ? "Adding..." : "Add Topic"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
