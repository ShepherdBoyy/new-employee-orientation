import { Link } from "@inertiajs/react";
import { Lock, Check, Folder } from "lucide-react";
import { cn } from "@/lib/utils";

export interface OrientationFolder {
    id: number;
    slug: string;
    name: string;
    slide_count: number;
    completed: boolean;
    locked: boolean;
}

interface Props {
    folder: OrientationFolder;
    index: number;
}

export default function FolderModuleCard({ folder, index }: Props) {
    const content = (
        <div
            className={cn(
                "group relative flex h-full flex-col items-center gap-3 rounded-2xl border p-5 text-center transition-all",
                folder.locked
                    ? "cursor-not-allowed border-border/60 bg-muted/30"
                    : folder.completed
                      ? "border-emerald-200 bg-emerald-50/60 hover:-translate-y-0.5 hover:shadow-md dark:border-emerald-900 dark:bg-emerald-950/20"
                      : "border-border bg-card hover:-translate-y-0.5 hover:shadow-lg",
            )}
        >
            {/* Order index chip */}
            <span
                className={cn(
                    "absolute left-3 top-3 flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold",
                    folder.locked
                        ? "bg-muted text-muted-foreground/50"
                        : folder.completed
                          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300"
                          : "bg-muted text-muted-foreground",
                )}
            >
                {index + 1}
            </span>

            <div className="relative mt-4 flex h-16 w-16 items-center justify-center">
                <Folder
                    className={cn(
                        "h-16 w-16 transition duration-200",
                        folder.locked
                            ? "fill-muted-foreground/10 text-muted-foreground/40"
                            : folder.completed
                              ? "fill-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                              : "fill-primary/10 text-muted-foreground/60 group-hover:fill-primary/15 group-hover:text-primary/70",
                    )}
                    strokeWidth={1.5}
                />

                {folder.completed && !folder.locked && (
                    <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 ring-2 ring-background">
                        <Check className="h-3 w-3 text-white" strokeWidth={3} />
                    </span>
                )}
                {folder.locked && (
                    <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-muted-foreground/40 ring-2 ring-background">
                        <Lock className="h-3 w-3 text-white" strokeWidth={2.5} />
                    </span>
                )}
            </div>

            <div className="min-w-0">
                <h3
                    className={cn(
                        "line-clamp-2 text-sm font-semibold leading-snug",
                        folder.locked
                            ? "text-muted-foreground/60"
                            : "text-foreground",
                    )}
                >
                    {folder.name}
                </h3>

                <p
                    className={cn(
                        "mt-1 text-xs",
                        folder.locked
                            ? "text-muted-foreground/50"
                            : "text-muted-foreground",
                    )}
                >
                    {folder.slide_count}{" "}
                    {folder.slide_count === 1 ? "slide" : "slides"}
                </p>

                {folder.completed && !folder.locked && (
                    <span className="mt-1 block text-xs font-medium text-emerald-600 dark:text-emerald-400">
                        Completed
                    </span>
                )}
                {folder.locked && (
                    <span className="mt-1 block text-xs font-medium text-muted-foreground/50">
                        Locked
                    </span>
                )}
            </div>
        </div>
    );

    if (folder.locked) {
        return <div>{content}</div>;
    }

    return (
        <Link
            href={`/orientation/folders/${folder.slug}`}
            className="block h-full"
        >
            {content}
        </Link>
    );
}