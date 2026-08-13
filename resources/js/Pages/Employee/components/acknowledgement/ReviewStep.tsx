import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { CheckCircle2, ChevronDown } from "lucide-react";

interface ProgressItem {
    folder_id: number;
    folder_name: string;
    slide_count: number;
    completed: boolean;
    topics: string[];
}

interface Props {
    progress: ProgressItem[];
}

export default function ReviewStep({ progress }: Props) {
    return (
        <div className="animate-in fade-in slide-in-from-right-2 space-y-4 duration-300">
            <div>
                <h2 className="text-sm font-semibold">
                    Modules Completed
                </h2>
                <p className="mt-0.5 text-xs text-muted-foreground">
                    Here's a summary of everything you've
                    gone through.
                </p>
            </div>
            <div className="space-y-2">
                {progress.map((item) => (
                    <Collapsible
                        key={item.folder_id}
                        className="overflow-hidden rounded-xl border bg-background"
                    >
                        <CollapsibleTrigger asChild>
                            <button
                                type="button"
                                className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-muted/40"
                            >
                                <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900/50 dark:text-emerald-400">
                                    <CheckCircle2 className="size-4" />
                                </div>

                                <div className="min-w-0 flex-1">
                                    <p className="truncate text-sm font-medium">
                                        {item.folder_name}
                                    </p>

                                    <p className="mt-0.5 text-xs text-muted-foreground">
                                        {item.slide_count}{" "}
                                        slides ·{" "}
                                        {item.topics.length}{" "}
                                        topics
                                    </p>
                                </div>
                                <ChevronDown className="size-4 shrink-0 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-180" />
                            </button>
                        </CollapsibleTrigger>

                        <CollapsibleContent>
                            <div className="border-t bg-muted/10 px-4 py-3">
                                <div className="space-y-2">
                                    {item.topics.map(
                                        (topic, index) => (
                                            <div
                                                key={`${item.folder_id}-${index}`}
                                                className="flex items-start gap-2.5 text-sm text-muted-foreground"
                                            >
                                                <span className="mt-2 size-1.5 shrink-0 rounded-full bg-muted-foreground/40" />

                                                <span>
                                                    {topic}
                                                </span>
                                            </div>
                                        ),
                                    )}
                                </div>
                            </div>
                        </CollapsibleContent>
                    </Collapsible>
                ))}
            </div>
        </div>
    );
}