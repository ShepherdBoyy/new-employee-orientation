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
import { Trash2Icon } from "lucide-react";
import { JobPosition } from "@/Pages/Admin/Types/job-position";
import { router } from "@inertiajs/react";
import { toast } from "sonner"

type Props = {
    job: JobPosition | null;
    onClose: () => void;
    onConfirm: () => void;
};

export default function DeleteJobDialog({ job, onClose, onConfirm }: Props) {
    function deleteHandle() {
        router.visit(`/admin/job-positions/${job?.id}`, {
            method: "delete",
            onSuccess: (message) => {
                toast.success(message.props.success, { position: "top-center" });
            },
        });
    }
    return (
        <>
            <AlertDialog
                open={!!job}
                onOpenChange={(open) => {
                    if (!open) onClose();
                }}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
                            <Trash2Icon />
                        </AlertDialogMedia>
                        <AlertDialogTitle>Delete Job</AlertDialogTitle>

                        <AlertDialogDescription>
                            Are you sure you want to delete{" "}
                            <strong>"{job?.name}"</strong>? It will be removed
                            from all assigned companies.
                        </AlertDialogDescription>
                    </AlertDialogHeader>

                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>

                        <AlertDialogAction
                            variant="destructive"
                            onClick={deleteHandle}
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
