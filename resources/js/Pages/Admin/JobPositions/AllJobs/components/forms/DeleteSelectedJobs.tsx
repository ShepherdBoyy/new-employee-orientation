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
    ids: number[];
    onClose: () => void;
    open: boolean;
    setIds: React.Dispatch<React.SetStateAction<number[]>>;
};
export default function DeleteSelectedJobs({
    ids,
    onClose,
    open,
    setIds,
}: Props) {
    function handleDeleteSelected() {
        router.delete("/admin/destroy-multiple-jobs", {
            data: {
                ids: ids,
            },
            onSuccess: (message) => {
                setIds([])
                toast.success(message.props.success, { position: "top-center" });
            },
        });
    }
    return (
        <AlertDialog
            open={open}
            onOpenChange={(open) => {
                if (!open) onClose();
            }}
        >
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogMedia className="bg-destructive/10 text-destructive">
                        <Trash2Icon />
                    </AlertDialogMedia>

                    <AlertDialogTitle>Delete Selected Jobs</AlertDialogTitle>

                    <AlertDialogDescription>
                        Delete <strong>{ids.length}</strong>{" "}
                        {ids.length === 1 ? "job" : "jobs"}? This will also
                        remove all company assignments.
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>

                    <AlertDialogAction
                        variant="destructive"
                        onClick={handleDeleteSelected}
                    >
                        Delete
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
