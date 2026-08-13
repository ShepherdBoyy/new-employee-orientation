import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
interface CompanyJobIds {
    company_id: number;
    job_position_id: number;
}

interface Props {
    companyJobIds: CompanyJobIds | null;
    isOpen: boolean;
    onClose: () => void;
    document:React.ReactNode
}

export default function ViewJdDialog({ isOpen, onClose, document }: Props) {
    return (
        <>
            <Dialog
                open={isOpen}
                onOpenChange={(open) => {
                    if (!open) onClose();
                }}
            >
                <DialogContent
                    className={"sm:max-w-6xl w-full h-[90vh] flex flex-col p-6"}
                >
                    <DialogHeader>
                        <DialogTitle>Job Description</DialogTitle>
                        <DialogDescription>
                            Job description for this position
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex-1 min-h-0 w-full rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
                        <iframe
                            src={`/storage/${document}#toolbar=0&navpanes=0`}
                            title="Job Description PDF"
                            className="w-full h-full border-none"
                        />
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
