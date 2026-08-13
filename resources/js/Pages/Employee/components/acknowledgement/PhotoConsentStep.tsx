import { Camera, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface Props {
    photo: string;
    consented: boolean;
    photoError?: string;
    consentError?: string;
    onOpenCamera: () => void;
    onRetake: () => void;
    onConsentChange: (checked: boolean) => void;
}

export default function PhotoConsentStep({
    photo,
    consented,
    photoError,
    consentError,
    onOpenCamera,
    onRetake,
    onConsentChange,
}: Props) {
    return (
        <div className="space-y-5">
            <div>
                <h2 className="text-sm font-semibold">Take a Photo</h2>
                <p className="mt-0.5 text-xs text-muted-foreground">
                    This confirms your identity for this acknowledgement. Your photo must be
                    taken live using your camera.
                </p>
            </div>

            {photo ? (
                <div className="space-y-3">
                    <div className="mx-auto aspect-square w-40 overflow-hidden rounded-2xl border">
                        <img src={photo} alt="Captured" className="h-full w-full object-cover" />
                    </div>
                    <div className="flex justify-center">
                        <Button type="button" variant="outline" size="sm" onClick={onRetake}>
                            <RotateCcw className="mr-1.5 h-3.5 w-3.5" />
                            Retake Photo
                        </Button>
                    </div>
                </div>
            ) : (
                <Button type="button" onClick={onOpenCamera} className="w-full">
                    <Camera className="mr-2 h-4 w-4" />
                    Open Camera
                </Button>
            )}

            {photoError && <p className="text-sm text-destructive">{photoError}</p>}

            <div className="flex items-start gap-2.5 rounded-xl border bg-muted/20 p-3.5">
                <Checkbox
                    id="consented"
                    checked={consented}
                    onCheckedChange={(checked) => onConsentChange(checked === true)}
                    className="mt-0.5"
                />
                <Label
                    htmlFor="consented"
                    className="text-xs font-normal leading-relaxed text-muted-foreground"
                >
                    I confirm that I have read, understood, and agree to comply with all
                    materials presented in this orientation. I consent to my electronic
                    signature and photo being securely stored as part of my official
                    orientation record, in accordance with the Data Privacy Act.
                </Label>
            </div>
            {consentError && <p className="text-sm text-destructive">{consentError}</p>}
        </div>
    );
}