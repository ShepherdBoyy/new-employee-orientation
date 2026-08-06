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
    topic: {
        id: number,
        label: string
    }
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

export default function DeleteTopicDialog({ topic ,open, onOpenChange }: Props) {
    function deleteHandle() {
        // router.visit(`/admin/job-positions/${topic?.id}`, {
        //     method: "delete",
        //     onSuccess: (message) => {
        //         toast.success(message.props.success, { position: "top-center" });
        //     },
        // });
    }
    return (
        <>
            <AlertDialog
                open={open} 
                onOpenChange={onOpenChange}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
                            <Trash2Icon />
                        </AlertDialogMedia>
                        <AlertDialogTitle>Delete Topic</AlertDialogTitle>

                        <AlertDialogDescription>
                            Are you sure you want to delete{" "}
                            <strong>{topic.label}</strong>?
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
