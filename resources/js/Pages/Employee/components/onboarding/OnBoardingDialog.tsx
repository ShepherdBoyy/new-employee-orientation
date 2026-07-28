import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";

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

    let content: React.ReactNode = null;

    switch (step) {
        case OnboardingStep.Welcome:
            content = (
                <div className="grid lg:grid-cols-2 w-full max-w-7xl rounded-3xl overflow-hidden border shadow-xl bg-background">
                    <WelcomeStep
                        user={user}
                        onNext={() => setStep(OnboardingStep.Modules)}
                    />

                    <motion.div
                        className="hidden lg:block h-full w-full rounded-lg p-2"
                        initial={{
                            opacity: 0,
                            scale: 1.02,
                        }}
                        animate={{
                            opacity: 1,
                            scale: 1,
                        }}
                        transition={{
                            delay: 0.2,
                            duration: 0.8,
                            ease: [0.22, 1, 0.36, 1],
                        }}
                    >
                        <video
                            src="/video/welcome.mp4"
                            className="h-full max-w-full rounded-xl object-cover"
                            autoPlay
                            muted
                            loop
                        />
                    </motion.div>
                </div>
            );
            break;

        case OnboardingStep.Modules:
            content = (
                <div className="w-full max-w-5xl rounded-3xl overflow-hidden border shadow-xl bg-background">
                    <ModulesStep
                        onBack={() => setStep(OnboardingStep.Welcome)}
                        onNext={() => setStep(OnboardingStep.Guidelines)}
                    />
                </div>
            );
            break;

        case OnboardingStep.Guidelines:
            content = (
                <div className="w-full max-w-7xl min-h-screen lg:h-200  overflow-hidden border bg-background shadow-xl rounded-3xl">
                    <GuidelinesStep />
                </div>
            );
            break;
    }

    return (
        <div className="">
            <AnimatePresence mode="wait">
                <motion.div
                    layout
                    key={step}
                    initial={{
                        opacity: 0,
                        y: 16,
                        scale: 0.985,
                    }}
                    animate={{
                        opacity: 1,
                        y: 0,
                        scale: 1,
                    }}
                    exit={{
                        opacity: 0,
                        y: -8,
                        scale: 0.995,
                    }}
                    transition={{
                        duration: 0.35,
                        ease: [0.22, 1, 0.36, 1],
                    }}
                >
                    {content}
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
