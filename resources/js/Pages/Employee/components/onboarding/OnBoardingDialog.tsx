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
                    <div className="border rounded-lg bg-muted "></div>
                </div>
            );
        case OnboardingStep.Modules:
            return (
                <div className="grid lg:grid-cols-2 w-full max-w-7xl rounded-3xl overflow-hidden border shadow-xl bg-background">
                    <ModulesStep
                        onBack={() => setStep(OnboardingStep.Welcome)}
                        onNext={() => setStep(OnboardingStep.Guidelines)}
                    />
                    <div className="border rounded-lg bg-muted "></div>
                </div>
            );
        case OnboardingStep.Guidelines:
            return (
                <div className="w-full max-w-7xl rounded-3xl overflow-hidden border shadow-xl bg-background">
                    <GuidelinesStep />
                </div>
            );

        default:
            return null;
    }
}
