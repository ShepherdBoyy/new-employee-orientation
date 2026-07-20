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
        <div className="relative mt-3 flex justify-center">
            <div className="relative h-50 w-full  transition-all duration-300 ease-out group-hover:-translate-y-2">
                {/* Folder Tab */}
                <div
                    className={cn(
                        "absolute left-4 top-0 h-5 w-16 rounded-t-lg border duration-300 border-b-0 group-hover:-translate-y-1 group-hover:translate-x-1",
                        folder.locked
                            ? "border-zinc-300 bg-zinc-200 dark:border-zinc-700 dark:bg-zinc-800"
                            : folder.completed
                              ? "border-emerald-300 bg-emerald-300 dark:border-emerald-700 dark:bg-emerald-800"
                              : "border-amber-300 bg-amber-300 dark:border-amber-700 dark:bg-amber-800",
                    )}
                />

                {/* Back Layer */}
                <div
                    className={cn(
                        "absolute left-1 top-3 h-40 w-full rounded-xl border transition-all duration-300 ease-out group-hover:translate-y-1",
                        folder.locked
                            ? "border-zinc-300 bg-zinc-200 dark:border-zinc-700 dark:bg-zinc-800"
                            : folder.completed
                              ? "border-emerald-300 bg-emerald-300 dark:border-emerald-700 dark:bg-emerald-800"
                              : "border-amber-300 bg-amber-300 dark:border-amber-700 dark:bg-amber-800",
                    )}
                />

                {/* Front Folder */}
                <div
                    className={cn(
                        "absolute top-5 flex h-40 w-full flex-col justify-between rounded-xl border p-4 shadow-sm transition-all duration-300 ease-out group-hover:-rotate-2 group-hover:shadow-lg",
                        folder.locked
                            ? "border-zinc-300 bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-900"
                            : folder.completed
                              ? "border-emerald-300 bg-emerald-100 dark:border-emerald-700 dark:bg-emerald-900"
                              : "border-amber-300 bg-amber-100 dark:border-amber-700 dark:bg-amber-900",
                    )}
                >
                    <div className="line-clamp-2 text-left font-medium   leading-7">
                        {folder.name}
                    </div>

                    <div className="flex items-center justify-between">
                        <span className="text-[12px] text-muted-foreground">
                            {folder.slide_count} slides
                        </span>

                        {folder.completed && (
                            <Check className="h-4 w-4 text-emerald-600" />
                        )}

                        {folder.locked && (
                            <Lock className="h-4 w-4 text-muted-foreground" />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );

    if (folder.locked) {
        return <div>{content}</div>;
    }

    return (
        <Link
            href={`/orientation/folders/${folder.slug}`}
            className="group block h-full"
        >
            {content}
        </Link>
    );
}
