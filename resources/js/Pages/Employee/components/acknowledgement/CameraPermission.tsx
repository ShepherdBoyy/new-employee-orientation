import { Camera, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";

interface Props {
    open: boolean;
    onAllow: () => void;
    onCancel: () => void;
}

export default function CameraPermission({ open, onAllow, onCancel }: Props) {
    return (
        <Dialog open={open} onOpenChange={(o) => !o && onCancel()}>
            <DialogContent className="sm:max-w-sm">
                <DialogHeader>
                    <div className="mx-auto mb-2 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <Camera className="h-5 w-5" />
                    </div>
                    <DialogTitle className="text-center">Camera Access Needed</DialogTitle>
                    <DialogDescription className="text-center">
                        We need to use your camera to take a live photo confirming your
                        identity. Your browser will ask you to allow camera access next.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex items-start gap-2.5 rounded-xl border bg-muted/20 p-3.5">
                    <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                    <p className="text-xs leading-relaxed text-muted-foreground">
                        Your photo is only used for this acknowledgement record and is
                        stored securely.
                    </p>
                </div>

                <DialogFooter className="sm:justify-center">
                    <Button variant="outline" onClick={onCancel}>
                        Cancel
                    </Button>
                    <Button onClick={onAllow}>
                        <Camera className="mr-2 h-4 w-4" />
                        Continue to Camera
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}