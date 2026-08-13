import { CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

const STEPS = ["Review", "Name & Signature", "Photo & Consent"] as const;

interface Props {
    step: number;
}

export default function StepIndicator({ step }: Props) {
    return (
        <div className="mb-8 flex items-center justify-center gap-2">
            {STEPS.map((label, i) => (
                <div key={label} className="flex items-center gap-2">
                    <div
                        className={cn(
                            "flex h-7 w-7 items-center justify-center rounded-full text-xs font-medium transition-colors",
                            i === step
                                ? "bg-primary text-primary-foreground"
                                : i < step
                                  ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300"
                                  : "bg-muted text-muted-foreground",
                        )}
                    >
                        {i < step ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
                    </div>
                    {i < STEPS.length - 1 && (
                        <div className={cn("h-px w-6", i < step ? "bg-emerald-300" : "bg-border")} />
                    )}
                </div>
            ))}
        </div>
    );
}

export { STEPS };