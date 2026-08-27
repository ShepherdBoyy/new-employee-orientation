import { useState } from "react";
import { Head, useForm } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { ShieldCheck, ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";

import StepIndicator, {
    STEPS,
} from "./components/acknowledgement/StepIndicator";
import ReviewStep from "./components/acknowledgement/ReviewStep";
import NameSignatureStep from "./components/acknowledgement/NameSignatureStep";
import PhotoConsentStep from "./components/acknowledgement/PhotoConsentStep";
import CameraPermission from "./components/acknowledgement/CameraPersmission";
import CameraCapture from "./components/acknowledgement/CameraCapture";

interface ProgressItem {
    folder_id: number;
    folder_name: string;
    slide_count: number;
    completed: boolean;
    topics: string[];
}

interface Props {
    user: { name: string };
    progress: ProgressItem[];
}

export default function Acknowledgement({ user, progress }: Props) {
    const [step, setStep] = useState(0);
    const [permissionPromptOpen, setPermissionPromptOpen] = useState(false);
    const [cameraOpen, setCameraOpen] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        full_name: "",
        signature: "",
        photo: "",
        consented: false as boolean,
    });

    function next() {
        setStep((s) => Math.min(s + 1, STEPS.length - 1));
    }

    function back() {
        setStep((s) => Math.max(s - 1, 0));
    }

    function handleSubmit() {
        post("/orientation/acknowledgement");
    }

    function handleRequestCamera() {
        setPermissionPromptOpen(true);
    }

    function handleAllowCamera() {
        setPermissionPromptOpen(false);
        setCameraOpen(true);
    }

    function handlePhotoCaptured(dataUrl: string) {
        setData("photo", dataUrl);
    }

    function handleRetakePhoto() {
        setData("photo", "");
        handleRequestCamera();
    }

    const canProceedFromNameSignature =
        data.full_name.trim().length > 0 && data.signature.length > 0;
    const canSubmit = data.photo.length > 0 && data.consented;

    return (
        <>
            <Head title="Final Acknowledgement" />

            <div className="mx-auto flex min-h-screen w-full max-w-2xl flex-col px-6 py-10">
                {/* Header */}
                <div className="mb-6 space-y-1 text-center">
                    <div className="mx-auto mb-2 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <ShieldCheck className="h-5 w-5" />
                    </div>
                    <h1 className="text-xl font-semibold tracking-tight">
                        Final Acknowledgement
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Please complete the steps below to finish your
                        orientation.
                    </p>
                </div>

                <StepIndicator step={step} />

                {/* Card */}
                <div className="rounded-2xl border bg-card p-6 shadow-sm">
                    {step === 0 && <ReviewStep progress={progress} />}

                    {step === 1 && (
                        <NameSignatureStep
                            userName={user.name}
                            fullName={data.full_name}
                            fullNameError={errors.full_name}
                            signatureError={errors.signature}
                            onFullNameChange={(value) =>
                                setData("full_name", value)
                            }
                            onSignatureChange={(value) =>
                                setData("signature", value ?? "")
                            }
                        />
                    )}

                    {step === 2 && (
                        <PhotoConsentStep
                            photo={data.photo}
                            consented={data.consented}
                            photoError={errors.photo}
                            consentError={errors.consented}
                            onOpenCamera={handleRequestCamera}
                            onRetake={handleRetakePhoto}
                            onConsentChange={(checked) =>
                                setData("consented", checked)
                            }
                        />
                    )}
                </div>

                <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <Button
                        variant="outline"
                        onClick={back}
                        disabled={step === 0}
                        className="w-full sm:w-auto"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back
                    </Button>

                    {step < STEPS.length - 1 ? (
                        <Button
                            onClick={next}
                            disabled={
                                step === 1 && !canProceedFromNameSignature
                            }
                            className="w-full sm:w-auto"
                        >
                            Next
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    ) : (
                        <Button
                            onClick={handleSubmit}
                            disabled={!canSubmit || processing}
                            className="w-full bg-emerald-600 hover:bg-emerald-500 sm:w-auto"
                        >
                            <CheckCircle2 className="mr-2 h-4 w-4" />
                            {processing
                                ? "Submitting..."
                                : "Submit Acknowledgement"}
                        </Button>
                    )}
                </div>
            </div>

            <CameraPermission
                open={permissionPromptOpen}
                onAllow={handleAllowCamera}
                onCancel={() => setPermissionPromptOpen(false)}
            />

            <CameraCapture
                open={cameraOpen}
                onCapture={handlePhotoCaptured}
                onClose={() => setCameraOpen(false)}
            />
        </>
    );
}
