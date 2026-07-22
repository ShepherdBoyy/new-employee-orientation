import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Field,
    FieldDescription,
    FieldLabel,
    FieldError,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { router, Form } from "@inertiajs/react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import React, { useEffect, useState } from "react";

interface CompanyJobIds {
    company_id: number;
    job_position_id: number;
}

interface Props {
    companyJobIds: CompanyJobIds | null;
    isOpen: boolean;
    onClose: () => void;
}

export default function ViewJdDialog({
    isOpen,
    onClose,
    document,
}: Props) {
    console.log(document);
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
