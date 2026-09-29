import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import SignaturePad from "@/components/SignaturePad";
import { Check } from "lucide-react";

interface Props {
    userName: string;
    fullName: string;
    fullNameError?: string;
    signatureError?: string;
    onFullNameChange: (value: string) => void;
    onSignatureChange: (value: string | null) => void;
}

export default function NameSignatureStep({
    userName,
    fullName,
    fullNameError,
    signatureError,
    onFullNameChange,
    onSignatureChange,
}: Props) {
    const nameMatches =
        fullName.trim().length > 0 &&
        fullName.trim().toLowerCase() === userName.trim().toLowerCase();

    return (
        <div className="animate-in fade-in slide-in-from-right-2 space-y-5 duration-300">
            <div className="space-y-1.5">
                <div>
                    <h2 className="text-sm font-semibold">
                        Confirm Your Full Name
                    </h2>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                        Type your full name exactly as registered:{" "}
                        <span className="font-medium text-foreground">
                            {userName}
                        </span>
                    </p>
                </div>
                <Label htmlFor="full_name" className="sr-only">
                    Full name
                </Label>
                <div className="relative">
                    <Input
                        id="full_name"
                        value={fullName}
                        onChange={(e) => onFullNameChange(e.target.value)}
                        placeholder={userName}
                        autoFocus
                        className="pr-9"
                    />
                    {nameMatches && (
                        <Check className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-emerald-600 dark:text-emerald-400" />
                    )}
                </div>
                {fullNameError && <p className="text-sm text-destructive">{fullNameError}</p>}
            </div>

            <div className="h-px w-full bg-border" />

            <div className="space-y-1.5">
                <div>
                    <h2 className="text-sm font-semibold">Your Signature</h2>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                        Draw your signature below using your mouse or
                        touchscreen.
                    </p>
                </div>
                <SignaturePad onChange={onSignatureChange} />
                {signatureError && <p className="text-sm text-destructive">{signatureError}</p>}
            </div>
        </div>
    );
}
