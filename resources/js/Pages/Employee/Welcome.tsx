import { useState } from "react";
import { Onboarding } from "./components/onboarding/OnBoardingDialog";
import type { OnboardingUser } from "./Types";
export type User = {
    user: OnboardingUser;
};

export default function Welcome({ user }: User) {
    const [open, setOpen] = useState(true);

    return (
        <div className="min-h-screen bg-muted/30">
            <Onboarding user={user} onFinish={() => setOpen(false)} />
        </div>
    );
}
