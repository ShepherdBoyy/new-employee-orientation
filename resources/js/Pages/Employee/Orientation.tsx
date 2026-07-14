import { useState } from "react";
import { OnboardingDialog } from "./components/onboarding/OnBoardingDialog";

export default function Orientation() {
    const [open, setOpen] = useState(true);

    return (
        <div className="min-h-screen bg-muted/30">
            <OnboardingDialog open={open} onFinish={() => setOpen(false)} />
        </div>
    );
}
