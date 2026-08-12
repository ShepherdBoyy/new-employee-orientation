import { router } from "@inertiajs/react";
import { cn } from "@/lib/utils";
import { Lock } from "lucide-react";

export interface PreviewFolder {
    id: number;
    name: string;
    slug: string;
    slide_count: number;
    is_job_specific: boolean;
    locked: boolean;
}

interface Props {
    folder: PreviewFolder;
    index: number;
}

export default function PreviewFolderCard({ folder, index }: Props) {
    function handleClick() {
        if (folder.locked || !folder.slug) return;
        router.visit(`/admin/folders/${folder.slug}/preview`);
    }

    return (
        <button
            onClick={handleClick}
            disabled={folder.locked}
            className={cn(
                "group block h-full text-left",
                folder.locked && "cursor-not-allowed opacity-50",
            )}
        >
            <div className="relative mt-3 flex justify-center">
                <div
                    className={cn(
                        "relative h-50 w-full transition-all duration-300 ease-out",
                        !folder.locked && "group-hover:-translate-y-2",
                    )}
                >
                    {/* Folder Tab */}
                    <div
                        className={cn(
                            "absolute left-4 top-0 h-5 w-16 rounded-t-lg border border-b-0 duration-300",
                            !folder.locked && "group-hover:-translate-y-1 group-hover:translate-x-1",
                            folder.is_job_specific
                                ? "border-purple-300 bg-purple-300 dark:border-purple-700 dark:bg-purple-800"
                                : "border-amber-300 bg-amber-300 dark:border-amber-700 dark:bg-amber-800",
                        )}
                    />

                    {/* Back Layer */}
                    <div
                        className={cn(
                            "absolute left-1 top-3 h-40 w-full rounded-xl border transition-all duration-300 ease-out",
                            !folder.locked && "group-hover:translate-y-1",
                            folder.is_job_specific
                                ? "border-purple-300 bg-purple-300 dark:border-purple-700 dark:bg-purple-800"
                                : "border-amber-300 bg-amber-300 dark:border-amber-700 dark:bg-amber-800",
                        )}
                    />

                    {/* Front Folder */}
                    <div
                        className={cn(
                            "absolute top-5 flex h-40 w-full flex-col justify-between rounded-xl border p-4 shadow-sm transition-all duration-300 ease-out",
                            !folder.locked && "group-hover:-rotate-2 group-hover:shadow-lg",
                            folder.is_job_specific
                                ? "border-purple-300 bg-purple-100 dark:border-purple-700 dark:bg-purple-900"
                                : "border-amber-300 bg-amber-100 dark:border-amber-700 dark:bg-amber-900",
                        )}
                    >
                        <div className="line-clamp-2 text-left font-medium leading-7">
                            {folder.name}
                        </div>

                        <div className="flex items-center justify-between">
                            {folder.locked ? (
                                <span className="flex items-center gap-1 text-[12px] text-muted-foreground">
                                    <Lock className="h-3 w-3" />
                                    Select a position
                                </span>
                            ) : (
                                <span className="text-[12px] text-muted-foreground">
                                    {folder.slide_count} slides
                                </span>
                            )}
                            <span className="text-[12px] font-semibold text-muted-foreground">
                                #{index + 1}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </button>
    );
}