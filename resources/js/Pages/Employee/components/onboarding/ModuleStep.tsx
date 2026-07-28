import OnboardingHeader from "./OnboardingHeader";
import {
    Puzzle,
    Projector,
    BadgeCheck,
    Signature,
    Rotate3d,
} from "lucide-react";
import { useState } from "react";

interface ModulesStepProps {
    onNext: () => void;
    onBack: () => void;
}

const instructions = [
    {
        icon: Puzzle,
        title: "Your Custom Path",
        description:
            "We've handpicked modules tailored specifically to your role and team.",
    },
    {
        icon: Projector,
        title: "Dive into the Slides",
        description:
            "Explore each presentation at your own pace to get up to speed.",
    },
    {
        icon: BadgeCheck,
        title: "Track Your Progress",
        description:
            "Check off each module as you finish to keep moving forward.",
    },
    {
        icon: Signature,
        title: "Make it Official",
        description:
            "Wrap up your orientation with a quick e-signature—you're almost there!",
    },
];

export default function ModulesStep({ onBack, onNext }: ModulesStepProps) {
    const [current, setCurrent] = useState(0);

    const currentInstruction = instructions[current];
    const Icon = currentInstruction.icon;
    return (
        <div className="flex flex-col">
            <OnboardingHeader />
            <div className="space-y-12 px-6 md:px-10 lg:px-14">
                <div className="space-y-6">
                    <h1 className="text-[40px]/snug font-light tracking-tight">
                        Let's get you ready.
                    </h1>

                    <p className="text-muted-foreground leading-7">
                        Here’s a quick overview of how your orientation works to
                        help you smoothly complete your modules and get the most
                        out of your training.
                    </p>
                </div>

                <div className="space-y-6 ">
                    <div
                        key={current}
                        className="bg-muted rounded-3xl p-10  shadow-lg"
                    >
                        <div className="flex items-center justify-end">
                            <span className="text-sm text-muted-foreground">
                                {Math.round(
                                    ((current + 1) / instructions.length) * 100,
                                )}
                                %
                            </span>
                        </div>

                        <div className="lg:mt-10 flex justify-center animate-in fade-in slide-in-from-right-4 duration-400">
                            <div className="flex h-20 w-20 items-center justify-center rounded-full">
                                <Icon
                                    className="h-14 w-14"
                                    strokeWidth={1.6}
                                    absoluteStrokeWidth
                                />
                            </div>
                        </div>

                        <div className="mt-4 lg:mt-8 text-center animate-in fade-in slide-in-from-right-4 duration-400">
                            <h2 className="text-4xl font-light tracking-tight">
                                {currentInstruction.title}
                            </h2>

                            <p className="mt-4 text-muted-foreground leading-7">
                                {currentInstruction.description}
                            </p>
                        </div>
                    </div>
                    <div className="lg:mt-8 flex justify-center gap-3">
                        {instructions.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrent(index)}
                                className={`h-2 rounded-full transition-all duration-300 ${
                                    current === index
                                        ? "w-8 bg-primary"
                                        : "w-2 bg-muted-foreground/30"
                                }`}
                            />
                        ))}
                    </div>
                    <div className="flex justify-between py-4 lg:py-8">
                        <button
                            onClick={() => {
                                if (current > 0) {
                                    setCurrent((prev) => prev - 1);
                                } else {
                                    onBack();
                                }
                            }}
                        >
                            {current === 0 ? "Back" : "Previous"}
                        </button>

                        <button
                            onClick={() => {
                                if (current < instructions.length - 1) {
                                    setCurrent((prev) => prev + 1);
                                } else {
                                    onNext();
                                }
                            }}
                        >
                            {current === instructions.length - 1
                                ? "Continue"
                                : "Next"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
