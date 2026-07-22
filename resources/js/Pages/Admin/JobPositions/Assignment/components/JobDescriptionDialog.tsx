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

export default function JobDescriptionDialog({
    isOpen,
    onClose,
    companyJobIds,
    jd_pdf,
}: Props) {
    const [isClient, setIsClient] = useState(false);
    // useEffect only runs in the browser, safely bypassing SSR
    useEffect(() => {
        setIsClient(true);
    }, []);
    return (
        <>
            <Dialog
                open={isOpen}
                onOpenChange={(open) => {
                    if (!open) onClose();
                }}
            >
                <DialogContent
                    className={cn(
                        jd_pdf
                            ? "sm:max-w-6xl w-full h-[90vh] flex flex-col p-6"
                            : "",
                    )}
                >
                    <DialogHeader>
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
                        <Form
                            action="/admin/upload-jd"
                            method="post"
                            transform={(data) => ({
                                ...data,
                                company_id: companyJobIds?.company_id,
                                job_position_id: companyJobIds?.job_position_id,
                            })}
                            className="space-y-5"
                        >
                            {({ errors }) => (
                                <>
                                    <Field>
                                        <FieldLabel htmlFor="pdf_file">
                                            Attach Job Description
                                        </FieldLabel>

                                        <Input
                                            id="pdf_file"
                                            name="pdf_file"
                                            type="file"
                                        />
                                        <FieldDescription>
                                            Select a pdf to upload.
                                        </FieldDescription>
                                        <FieldError>
                                            {errors.pdf_file && (
                                                <div className="text-red-500 text-sm">
                                                    {errors.pdf_file}
                                                </div>
                                            )}
                                        </FieldError>
                                    </Field>
                                    <DialogFooter>
                                        <Button type="submit">Submit</Button>
                                    </DialogFooter>
                                </>
                            )}
                        </Form>
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
}
