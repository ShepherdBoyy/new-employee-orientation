import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { type CompanyFolder } from './FolderCard'

interface Props {
    folder: CompanyFolder | null
    onCancel: () => void
    onConfirm: () => void
}

export default function DeleteFolderDialog({ folder, onCancel, onConfirm }: Props) {
    return (
        <AlertDialog open={!!folder} onOpenChange={open => !open && onCancel()}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Delete "{folder?.name}"?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This will permanently delete this folder and all slides inside it. This action cannot be
                        undone.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={onCancel}>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={onConfirm}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                        Delete
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}