import { useState } from "react";
import { OnboardingDialog } from "./components/onboarding/OnBoardingDialog";

export type UserProps = {
    name: string;
    companyName: string;
    jobPosition: string;
};

export type User = {
    user: UserProps
}

export default function Orientation({user}: User) {
    const [open, setOpen] = useState(true);

    return (
        <div className="min-h-screen bg-muted/30">
            <OnboardingDialog
                user={user}
                open={open}
                onFinish={() => setOpen(false)}
            />
        </div>
    );
}
