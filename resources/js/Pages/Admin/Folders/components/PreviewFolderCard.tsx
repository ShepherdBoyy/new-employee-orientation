import { router } from "@inertiajs/react";
import { cn } from "@/lib/utils";

export interface PreviewFolder {
    id: number;
    name: string;
    slug: string;
    slide_count: number;
}

interface Props {
    folder: PreviewFolder;
    index: number;
}

export default function PreviewFolderCard({ folder, index }: Props) {
    function handleClick() {
        router.visit(`/admin/folders/${folder.slug}/preview`);
    }

    return (
        <button onClick={handleClick} className="group block h-full text-left">
            <div className="relative mt-3 flex justify-center">
                <div className="relative h-50 w-full transition-all duration-300 ease-out group-hover:-translate-y-2">
                    {/* Folder Tab */}
                    <div
                        className={cn(
                            "absolute left-4 top-0 h-5 w-16 rounded-t-lg border border-b-0 duration-300 group-hover:-translate-y-1 group-hover:translate-x-1",
                            "border-amber-300 bg-amber-300 dark:border-amber-700 dark:bg-amber-800",
                        )}
                    />

                    {/* Back Layer */}
                    <div
                        className={cn(
                            "absolute left-1 top-3 h-40 w-full rounded-xl border transition-all duration-300 ease-out group-hover:translate-y-1",
                            "border-amber-300 bg-amber-300 dark:border-amber-700 dark:bg-amber-800",
                        )}
                    />

                    {/* Front Folder */}
                    <div
                        className={cn(
                            "absolute top-5 flex h-40 w-full flex-col justify-between rounded-xl border p-4 shadow-sm transition-all duration-300 ease-out group-hover:-rotate-2 group-hover:shadow-lg",
                            "border-amber-300 bg-amber-100 dark:border-amber-700 dark:bg-amber-900",
                        )}
                    >
                        <div className="line-clamp-2 text-left font-medium leading-7">
                            {folder.name}
                        </div>

                        <div className="flex items-center justify-between">
                            <span className="text-[12px] text-muted-foreground">
                                {folder.slide_count} slides
                            </span>
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
