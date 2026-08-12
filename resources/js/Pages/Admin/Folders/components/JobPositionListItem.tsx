import { Link } from "@inertiajs/react";
import { ChevronRight } from "lucide-react";
import { motion } from "motion/react";

export interface PickerPosition {
    id: number;
    name: string;
    has_folder: boolean;
    folder_slug: string | null;
}

interface Props {
    companyId: number;
    position: PickerPosition;
    index: number;
}

export default function JobPositionListItem({
    companyId,
    position,
    index,
}: Props) {
    return (
        <motion.div
            initial={{
                opacity: 0,
                y: 8,
            }}
            animate={{
                opacity: 1,
                y: 0,
            }}
            transition={{
                duration: 0.25,
                delay: index * 0.05,
                ease: "easeOut",
            }}
        >
            <Link
                href={`/admin/folders/${companyId}/job-positions/${position.id}/resolve`}
                className="block"
            >
                <div
                    className="
                        group
                        flex w-full items-center gap-3
                        rounded-xl border bg-card
                        px-4 py-3
                        text-left
                        transition-all duration-200
                        hover:-translate-y-0.5
                        hover:border-primary/30
                        hover:shadow-sm
                    "
                >
                    <span className="flex-1 text-sm font-medium">
                        {position.name}
                    </span>

                    <ChevronRight
                        className="
                            h-4 w-4 shrink-0
                            text-muted-foreground
                            transition-all duration-200
                            group-hover:translate-x-0.5
                            group-hover:text-foreground
                        "
                    />
                </div>
            </Link>
        </motion.div>
    );
}
