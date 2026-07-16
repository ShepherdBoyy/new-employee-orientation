import { useState } from "react";
import { Onboarding } from "./components/onboarding/OnBoardingDialog";
import type { OnboardingUser } from "./Types";
export type User = {
    user: OnboardingUser;
};

export default function Welcome({ user }: User) {
    return (
        <div className="min-h-screen mx-auto flex items-center justify-center font-poppins bg-[#001524]">
            <Onboarding user={user} />
        </div>
    );
}
