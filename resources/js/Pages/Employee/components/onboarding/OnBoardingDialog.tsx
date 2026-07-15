import { useState } from "react";

import { WelcomeStep } from "./WelcomeStep";
import { ModulesStep } from "./ModuleStep";
import type { OnboardingUser } from "../../Types";
interface OnboardingProps {
    onFinish?: () => void;
    user: OnboardingUser;
}

export function Onboarding({ onFinish, user }: OnboardingProps) {
    const [step, setStep] = useState(0);

    return (
        <div className=" mx-auto flex items-center justify-center min-h-screen font-poppins ">
            <div className=" grid lg:grid-cols-2 w-full max-w-7xl rounded-3xl overflow-hidden border shadow-xl bg-background">
                {step === 0 && (
                    <WelcomeStep user={user} onNext={() => setStep(1)} />
                )}

                {step === 1 && (
                    <ModulesStep
                        onBack={() => setStep(0)}
                        onFinish={onFinish}
                    />
                )}
                <div className="border rounded-lg bg-muted "></div>
            </div>
        </div>
    );
}
