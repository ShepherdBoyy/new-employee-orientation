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
import { toast } from "sonner";
import { Document, pdfjs, Page } from 'react-pdf'
import React, { lazy, Suspense, useEffect, useState } from 'react';



interface CompanyJobIds {
    company_id: number,
    job_position_id: number
}

interface Props {
    companyJobIds: CompanyJobIds | null;
    isOpen: boolean;
    onClose: () => void;
}
const PdfViewer = lazy(() => import('@/Layout/PdfViewer'));

export default function JobDescriptionDialog({ isOpen, onClose, companyJobIds, jd_pdf }: Props) {
    
    const [isClient, setIsClient] = useState(false);

    // useEffect only runs in the browser, safely bypassing SSR
    useEffect(() => {
        setIsClient(true);
    }, []);
    return (
        <>
            <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
                <DialogContent className="sm:max-w-3xl w-full max-h-[90vh] flex flex-col">
                    <DialogHeader>
                        <DialogTitle>Job Description</DialogTitle>
                        <DialogDescription>
                            Job description for this company
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex flex-col items-center gap-2 flex-1 min-h-0 w-full">
                        <div className="grid flex-1 gap-2 w-full min-h-0">

                            {jd_pdf ? (
                                <div className="w-full max-h-[60vh] overflow-y-auto border border-gray-200 rounded-lg p-2 bg-gray-50 [&_canvas]:!w-full [&_canvas]:!h-auto">
                                    <Suspense fallback={<div>Loading PDF Viewer...</div>}>
                                        <PdfViewer fileUrl={jd_pdf.file_path} />
                                    </Suspense> 
                                </div>
                            )
                            :
                            (
                                <div>
                                    <Form 
                                        action="/admin/upload-jd" 
                                        method="post"
                                        transform={(data) => ({ ...data, 
                                            company_id: companyJobIds?.company_id, 
                                            job_position_id: companyJobIds?.job_position_id 
                                        })}
                                    >
                                        {({
                                            errors
                                        }) => ( 
                                            <>
                                                <Field className="pb-3">
                                                    <div className="flex gap-2">
                                                        <FieldLabel htmlFor="pdf_file">PDF</FieldLabel>
                                                        {errors.pdf_file && <div>{errors.pdf_file}</div>}
                                                    </div>
                                                    <Input id="pdf_file" name="pdf_file" type="file" />
                                                    <FieldDescription>Select a pdf to upload.</FieldDescription>
                                                    
                                                </Field>
                                                
                                                <Button>Submit</Button>
                                            </>
                                        )}
                                    </Form>
                                </div>
                            )}                            
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
