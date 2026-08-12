import { useForm } from "@inertiajs/react";
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
import { Field, FieldLabel, FieldGroup } from "@/components/ui/field";
import { toast } from "sonner";

type Props = {
    topic: {
        id: number;
        label: string;
    };
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

export default function EditTopicDialog({ topic, open, onOpenChange }: Props) {
    const { data, setData, put, processing, errors, reset } = useForm({
        label: "",
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!topic) return;

        put(`/admin/topics/${topic.id}`, {
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
                    <DialogTitle>Edit Topic</DialogTitle>

                    <DialogDescription>
                        Edit topic for your module.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <FieldGroup>
                        <Field>
                            <FieldLabel>Topic</FieldLabel>

                            <Input
                                placeholder={topic.label}
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

                        <Button type="submit">
                            {processing ? "Saving..." : "Save Changes"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
