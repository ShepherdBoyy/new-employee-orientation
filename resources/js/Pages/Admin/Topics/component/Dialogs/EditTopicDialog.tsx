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
    topic: {
        id: number,
        label: string,
    };
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

export default function AddTopicDialog({ topic, open, onOpenChange }: Props) {
    
    const form = useForm({
        name: "",
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        console.log(topic)

        // form.post("", {
        //     preserveScroll: true,

        //     onSuccess: (message) => {
        //         form.reset();
        //         onOpenChange(false);
        //         toast.success(message.props.success, {
        //             position: "top-center",
        //         });
        //     },
        // });
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
                            {form.processing ? "Editing..." : "Edit Topic"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
