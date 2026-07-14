import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogMedia,
} from "@/components/ui/alert-dialog";
import { PinOff, Trash2Icon } from "lucide-react";
import { router } from "@inertiajs/react";
import { toast } from "sonner";

interface JobWithPivot {
    id: number;
    name: string;
    pivot: {
        company_id: number;
        [key: string]: any;
    };
}

type Props = {
    job: JobWithPivot | null;
    companyName?: string;
    onClose: () => void;
};

export default function RemoveJobDialog({ job, companyName, onClose }: Props) {
    function deleteHandle() {
        if (!job) return;

        router.delete(
            `/admin/delete-assigned-job/${job.pivot.company_id}/${job.id}`,
            {
                preserveScroll: true,
                onSuccess: (message) => {
                    onClose();
                    toast.success(message.props.success, { position: "top-center" });
                },
            },
        );
    }

    return (
        <AlertDialog
            open={!!job}
            onOpenChange={(open) => {
                if (!open) onClose();
            }}
        >
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
                        <PinOff className="h-5 w-5" />
                    </AlertDialogMedia>
                    <AlertDialogTitle>Unlink Job Position</AlertDialogTitle>

                    <AlertDialogDescription>
                        Are you sure you want to unassign{" "}
                        <strong className="text-foreground">
                            "{job?.name}"
                        </strong>{" "}
                        from{" "}
                        <strong className="text-foreground">
                            {companyName || "this company"}
                        </strong>
                        ? This removes the connection but will not delete the
                        core job record from your system.
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                    <AlertDialogCancel onClick={onClose}>
                        Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                        variant="destructive"
                        onClick={deleteHandle}
                    >
                        Unlink Position
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
