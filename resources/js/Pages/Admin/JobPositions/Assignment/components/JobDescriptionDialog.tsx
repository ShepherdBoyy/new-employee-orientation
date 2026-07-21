import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Field,
  FieldDescription,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button";
import { PinOff, Trash2Icon } from "lucide-react";
import { router, Form } from "@inertiajs/react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import React, { useEffect, useState } from 'react';

interface CompanyJobIds {
    company_id: number,
    job_position_id: number
}

interface Props {
    companyJobIds: CompanyJobIds | null;
    isOpen: boolean;
    onClose: () => void;
}

export default function JobDescriptionDialog({ isOpen, onClose, companyJobIds, jd_pdf }: Props) {
    
    const [isClient, setIsClient] = useState(false);
    // useEffect only runs in the browser, safely bypassing SSR
    useEffect(() => {
        setIsClient(true);
    }, []);
    return (
        <>
            <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
                <DialogContent
                    className={cn(
                        jd_pdf
                        ? "sm:max-w-6xl w-full h-[90vh] flex flex-col p-6"
                        : "sm:max-w-4xl w-full flex flex-col p-6"
                    )}
                >
                    <DialogHeader className="shrink-0 pb-4">
                        <DialogTitle>Job Description</DialogTitle>
                        <DialogDescription>
                            Job description for this position
                        </DialogDescription>
                    </DialogHeader>
                        {jd_pdf ? (
                            <div className="flex-1 min-h-0 w-full rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
                                <iframe
                                    src={`/storage/${jd_pdf.file_path}#toolbar=0&navpanes=0`}
                                    title="Job Description PDF"
                                    className="w-full h-full border-none"
                                />
                            </div>
                        ) : (
                            <div className="p-4 h-full overflow-y-auto">
                                <Form 
                                    action="/admin/upload-jd" 
                                    method="post"
                                    transform={(data) => ({ 
                                        ...data, 
                                        company_id: companyJobIds?.company_id, 
                                        job_position_id: companyJobIds?.job_position_id 
                                    })}
                                >
                                    {({ errors }) => ( 
                                        <div className="space-y-4">
                                            <Field className="pb-3">
                                                <div className="flex gap-2">
                                                    <FieldLabel htmlFor="pdf_file">PDF</FieldLabel>
                                                    {errors.pdf_file && <div className="text-red-500 text-sm">{errors.pdf_file}</div>}
                                                </div>
                                                <Input id="pdf_file" name="pdf_file" type="file" />
                                                <FieldDescription>Select a pdf to upload.</FieldDescription>
                                            </Field>
                                            <Button type="submit">Submit</Button>
                                        </div>
                                    )}
                                </Form>
                            </div>
                        )} 
                </DialogContent>
            </Dialog>
        </>
    );
}
