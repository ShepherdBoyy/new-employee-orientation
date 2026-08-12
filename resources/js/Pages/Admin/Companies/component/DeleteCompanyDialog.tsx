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
import type { Company } from "../../Types/company";

type DeleteCompanyDialogProps = {
    company: Company | null;
    onClose: () => void;
    onConfirm: () => void;
};

export default function DeleteCompanyDialog({
    company,
    onClose,
    onConfirm,
}: DeleteCompanyDialogProps) {
    return (
        <AlertDialog
            open={!!company}
            onOpenChange={(open) => {
                if (!open) onClose();
            }}
        >
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
                        <Trash2Icon />
                    </AlertDialogMedia>
                    <AlertDialogTitle>Delete Company</AlertDialogTitle>

                    <AlertDialogDescription>
                        Are you sure you want to delete
                        <strong> {company?.name}</strong>? This action cannot be
                        undone.
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>

                    <AlertDialogAction
                        variant="destructive"
                        onClick={onConfirm}
                    >
                        Delete
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
