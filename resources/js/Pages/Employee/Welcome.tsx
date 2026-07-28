import { useState } from "react";
import { Onboarding } from "./components/onboarding/OnBoardingDialog";
import type { OnboardingUser } from "./Types";
type User = {
    user: OnboardingUser;
};

export default function Welcome({ user }: User) {
    return (
        <div className="min-h-dvh bg-muted/30">
            <div className="mx-auto flex min-h-dvh items-center justify-center p-4 md:p-6 lg:p-8  bg-[#001524]">
                <Onboarding user={user} />
            </div>
        </div>
    );
}
