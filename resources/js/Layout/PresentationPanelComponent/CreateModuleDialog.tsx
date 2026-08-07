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
import { Label } from "@/components/ui/label";
import KeyTopicsInput from "../../Pages/Admin/Folders/components/KeyTopicsInput";
import { toast } from "sonner";

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
            onSuccess: (message) => {
                (reset(),
                    onClose(),
                    toast.success(message.props.success, {
                        position: "top-center",
                    }));
            },
        });
    }

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Create Folder</DialogTitle>
                    <DialogDescription>
                        Give this module a clear, descriptive name and list what
                        it covers.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1.5">
                        <Label htmlFor="name">Folder name</Label>
                        <Input
                            id="name"
                            value={data.name}
                            onChange={(e) => setData("name", e.target.value)}
                            placeholder="e.g. Company Overview"
                            autoFocus
                        />
                        {errors.name && (
                            <p className="text-sm text-destructive">
                                {errors.name}
                            </p>
                        )}
                    </div>

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
