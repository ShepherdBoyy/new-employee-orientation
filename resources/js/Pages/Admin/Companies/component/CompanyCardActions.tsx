import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { CompanyWithJobCount } from "../../Types/company";
import { EllipsisVertical, Trash, Pen } from "lucide-react";

type CompanyCardActionsProps = {
    company: CompanyWithJobCount;
    onEdit: (company: CompanyWithJobCount) => void;
    onDelete: (company: CompanyWithJobCount) => void;
};

export default function CompanyCardActions({
    company,
    onEdit,
    onDelete,
}: CompanyCardActionsProps) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                    <EllipsisVertical color="white" />
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEdit(company)}>
                    <Pen className="mr-2 h-4 w-4" />
                    Edit
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                    variant="destructive"
                    onClick={() => onDelete(company)}
                >
                    <Trash className="mr-2 h-4 w-4" />
                    Delete
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
