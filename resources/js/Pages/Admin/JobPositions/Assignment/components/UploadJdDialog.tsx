import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Field,
    FieldDescription,
    FieldLabel,
    FieldError,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form } from "@inertiajs/react";

interface CompanyJobIds {
    company_id: number;
    job_position_id: number;
}

interface Props {
    companyJobIds: CompanyJobIds | null;
    isOpen: boolean;
    onClose: () => void;
}

export default function UploadJdDialog({
    isOpen,
    onClose,
    companyJobIds,
}: Props) {
    return (
        <>
            <Dialog
                open={isOpen}
                onOpenChange={(open) => {
                    if (!open) onClose();
                }}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Job Description</DialogTitle>
                        <DialogDescription>
                            Job description for this position
                        </DialogDescription>
                    </DialogHeader>
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
                </DialogContent>
            </Dialog>
        </>
    );
}
