import { useState } from "react";

import WelcomeStep from "./WelcomeStep";
import ModulesStep from "./ModuleStep";
import GuidelinesStep from "./GuidelinesStep";
import type { OnboardingUser } from "../../Types";
import { OnboardingStep } from "../../Types";

interface OnboardingProps {
    onFinish?: () => void;
    user: OnboardingUser;
}

export function Onboarding({ onFinish, user }: OnboardingProps) {
    const [step, setStep] = useState(OnboardingStep.Welcome);
    switch (step) {
        case OnboardingStep.Welcome:
            return (
                <div className="grid lg:grid-cols-2 w-full max-w-7xl rounded-3xl overflow-hidden border shadow-xl bg-background">
                    <WelcomeStep
                        user={user}
                        onNext={() => setStep(OnboardingStep.Modules)}
                    />
                    <div className="rounded-lg w-full h-full p-2">
                        <video
                            src="/video/welcome.mp4"
                            className="max-w-full h-full rounded-xl object-cover"
                            autoPlay
                            muted
                            loop
                        />
                    </div>
                </div>
            );
        case OnboardingStep.Modules:
            return (
                <div className="w-full max-w-5xl rounded-3xl overflow-hidden border shadow-xl bg-background">
                    <ModulesStep
                        onBack={() => setStep(OnboardingStep.Welcome)}
                        onNext={() => setStep(OnboardingStep.Guidelines)}
                    />
                </div>
            );
        case OnboardingStep.Guidelines:
            return (
                <div className=" w-full max-w-7xl min-h-screen lg:h-200 rounded-none lg:rounded-3xl overflow-hidden border shadow-xl bg-background">
                    <GuidelinesStep />
                </div>
            );

        default:
            return null;
    }
}
