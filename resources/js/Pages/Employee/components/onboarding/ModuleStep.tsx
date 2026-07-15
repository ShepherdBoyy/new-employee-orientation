import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

import {
    Puzzle,
    Projector,
    BadgeCheck,
    Signature,
    Rotate3d,
} from "lucide-react";

interface ModulesStepProps {
    onNext: () => void;
    onBack: () => void;
}

const instructions = [
    {
        icon: Puzzle,
        title: "Assigned Modules",
        description: "Modules are assigned based on your company and position.",
    },
    {
        icon: Projector,
        title: "Review Slides",
        description: "Read each presentation carefully before proceeding.",
    },
    {
        icon: BadgeCheck,
        title: "Confirm Completion",
        description: "Mark each module as completed once you've reviewed it.",
    },
    {
        icon: Signature,
        title: "Electronic Signature",
        description:
            "Complete your orientation by signing after finishing all modules.",
    },
];

export default function ModulesStep({ onBack, onNext }: ModulesStepProps) {
    return (
        <div className="flex flex-col">
            <div className="flex gap-2 items-center px-6 py-6 ">
                <Rotate3d absoluteStrokeWidth strokeWidth={1.5} size={22} />
                <p className="">NEO</p>
            </div>
            <div className="space-y-12 px-12">
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

                <div className="space-y-6">
                    {instructions.map((item, index) => {
                        const Icon = item.icon;
                        const progress = [20, 40, 60, 100][index];

                        return (
                            <div
                                key={item.title}
                                className="relative flex gap-6"
                            >
                                {/* Timeline */}
                                <div className="flex flex-col items-center">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-full border bg-background">
                                        <Icon
                                            absoluteStrokeWidth
                                            strokeWidth={1.6}
                                            className="h-5 w-5"
                                        />
                                    </div>

                                    {index !== instructions.length - 1 && (
                                        <div className="mt-2 h-12 w-px bg-border" />
                                    )}
                                </div>

                                {/* Content */}
                                <div className="pb-4">
                                    <p className="text-xs font-medium text-primary">
                                        {progress}% Complete
                                    </p>

                                    <h3 className="mt-1  font-medium">
                                        {item.title}
                                    </h3>

                                    <p className="mt-1 text-muted-foreground text-sm">
                                        {item.description}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                    <div className="flex justify-between py-8">
                        <button onClick={onBack}>Back</button>

                        <button onClick={onNext}>Start Orientation</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
