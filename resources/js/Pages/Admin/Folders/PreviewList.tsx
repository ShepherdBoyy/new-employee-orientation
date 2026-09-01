import { Link, router } from "@inertiajs/react";
import { ArrowLeft } from "lucide-react";
import PreviewFolderCard, {
    type PreviewFolder,
} from "./components/PreviewFolderCard";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useState } from "react";

interface Company {
    id: number;
    name: string;
    slug: string;
}

interface Props {
    folders: PreviewFolder[];
    company: Company;
    employeeType: "field" | "non_field";
}

export default function PreviewList({ folders, company, employeeType }: Props) {
    const [selectedType, setSelectedType] = useState<"field" | "non_field">(
        employeeType,
    );

    function handleSelectType(value: string) {
        const type = value as "field" | "non_field";
        setSelectedType(type);

        const params = new URLSearchParams({
            company_id: String(company.id),
            employee_type: type,
        });
        router.visit(`/admin/folders/preview-list?${params.toString()}`);
    }

    const typeLabel = selectedType === "field" ? "Field-Based" : "Non-Field";

    return (
        <div className="flex min-h-screen w-full flex-col bg-zinc-950">
            <div className="flex shrink-0 items-center justify-between bg-indigo-600 px-6 py-2.5 text-sm text-white">
                <Link
                    href={`/admin/folders/${company.slug}`}
                    className="inline-flex items-center gap-1.5 text-indigo-200 hover:text-white"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to folders
                </Link>
                <div className="flex items-center gap-2">
                    <span className="font-medium">Admin Preview</span>
                    <span className="text-indigo-300">—</span>
                    <span className="text-indigo-200">
                        {company.name}
                    </span>
                </div>
            </div>

            <div className="mx-auto w-full max-w-5xl flex-1 space-y-8 px-6 py-12">
                <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                        <h1 className="text-2xl font-semibold text-white">
                            Orientation Modules
                        </h1>
                        <p className="text-sm text-zinc-400">
                            {folders.length === 0
                                ? "No folders are assigned to this audience yet."
                                : `${folders.length} ${folders.length === 1 ? "module" : "modules"} in this orientation.`}
                        </p>
                    </div>

                    <Select
                        value={selectedType}
                        onValueChange={handleSelectType}
                    >
                        <SelectTrigger className="w-56 border-zinc-700 bg-zinc-900 text-white">
                            <SelectValue placeholder="View as employee type" />
                        </SelectTrigger>
                        <SelectContent position="popper">
                            <SelectItem value="field">Field-Based</SelectItem>
                            <SelectItem value="non_field">Non-Field</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {folders.length > 0 ? (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {folders.map((folder, index) => (
                            <PreviewFolderCard
                                key={folder.id}
                                folder={folder}
                                index={index}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="rounded-2xl border border-dashed border-zinc-800 py-16 text-center text-zinc-500">
                        No folders assigned to this audience yet.
                    </div>
                )}
            </div>
        </div>
    );
}
