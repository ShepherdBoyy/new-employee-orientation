import { router } from "@inertiajs/react";
import { ChevronRight, CheckCircle2, Circle } from "lucide-react";

export interface PickerPosition {
    id: number;
    name: string;
    has_folder: boolean;
    folder_slug: string | null;
}

interface Props {
    companyId: number;
    position: PickerPosition;
}

export default function JobPositionListItem({ companyId, position }: Props) {
    function handleClick() {
        router.post(
            `/admin/folders/${companyId}/job-positions/${position.id}/resolve`,
        );
    }

    return (
        <button
            onClick={handleClick}
            className="flex w-full items-center gap-3 rounded-xl border bg-card px-4 py-3 text-left transition-colors hover:border-foreground/15"
        >
            <span className="flex-1 text-sm font-medium">{position.name}</span>
            <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
        </button>
    );
}
