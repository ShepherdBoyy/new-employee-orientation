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

type Props = {
    job: JobPosition | null;
    onClose: () => void;
    onConfirm: () => void;
};


export default function RemoveJobDialog({ job, onClose, onConfirm }: Props) {
    function deleteHandle() {
        router.visit(`/admin/delete-assigned-job/${job?.pivot.company_id}/${job?.id}`,{
            method:'delete',
            onSuccess: () => {

            }
        })
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
                            Are you sure you want to remove this job{" "}
                            <strong>"{job?.name}"</strong>? It will be removed
                            from assigned companies.
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
