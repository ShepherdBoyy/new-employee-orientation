import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

import {
    FolderOpen,
    BookOpen,
    BadgeCheck,
    FileSignature,
    Rotate3d,
} from "lucide-react";

interface ModulesStepProps {
    onBack: () => void;
    onFinish?: () => void;
}

const instructions = [
    {
        icon: FolderOpen,
        title: "Assigned Modules",
        description: "Modules are assigned based on your company and position.",
    },
    {
        icon: BookOpen,
        title: "Review Slides",
        description: "Read each presentation carefully before proceeding.",
    },
    {
        icon: BadgeCheck,
        title: "Confirm Completion",
        description: "Mark each module as completed once you've reviewed it.",
    },
    {
        icon: FileSignature,
        title: "Electronic Signature",
        description:
            "Complete your orientation by signing after finishing all modules.",
    },
];

export function ModulesStep({ onBack, onFinish }: ModulesStepProps) {
    return (
        <div className="flex flex-col">
            <div className="flex gap-2 items-center px-6 py-6">
                <Rotate3d absoluteStrokeWidth strokeWidth={1.5} size={22} />
                <p className="">NEO</p>
            </div>
            <div className="space-y-12 px-12 ">
                <h1 className="text-3xl">How NEO Works</h1>

                <p className="text-muted-foreground mt-2">
                    Please review the following instructions before beginning
                    your orientation.
                </p>
                <div className="grid grid-cols-2 gap-4">
                    {instructions.map((item) => {
                        const Icon = item.icon;

                        return (
                            <Card
                                key={item.title}
                                className="flex items-start gap-4 p-5"
                            >
                                <Icon className="h-6 w-6 mt-1 text-primary" />

                                <div>
                                    <h3 className="font-semibold">
                                        {item.title}
                                    </h3>

                                    <p className="text-sm text-muted-foreground">
                                        {item.description}
                                    </p>
                                </div>
                            </Card>
                        );
                    })}
                </div>

                <div className="flex justify-between">
                    <button onClick={onBack}>Back</button>

                    <button onClick={onFinish}>Start Orientation</button>
                </div>
            </div>
        </div>
    );
}
