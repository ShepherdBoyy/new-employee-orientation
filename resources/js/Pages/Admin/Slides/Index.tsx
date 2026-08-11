import { useRef, useState } from "react";
import { router, Link } from "@inertiajs/react";
import { ArrowLeft, Upload, Eye, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import SlideGrid from "./components/SlideGrid";
import { type Slide } from "./components/SlideItem";
import Master from "@/Layout/Master";
import UploadSlidesDialog from "./components/UploadSlidesDialog";

interface Company {
    id: number;
    name: string;
    slug: string;
}

interface JobPosition {
    id: number;
    name: string;
    slug: string;
}

export interface Folder {
    id: number;
    name: string;
    slug: string;
    company: Company;
    job_position: JobPosition | null;
    is_job_specific: boolean;
}

interface Topic {
    id: number;
    slug: string;
    label: string;
}

interface Props {
    activeFolder: Folder;
    slides: Slide[];
    topic: Topic;
}

function Index({ activeFolder, slides, topic }: Props) {
    const [uploadOpen, setUploadOpen] = useState(false);

    const backHref = `/admin/folders/${activeFolder.company.slug}/${activeFolder.slug}`;
    return (
        <>
            <div className="w-full space-y-6">
                <Link
                    href={backHref}
                    className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
                >
                    <ArrowLeft className="h-4 w-4" />
                    {activeFolder.is_job_specific ? (
                        <div>Back to {activeFolder.job_position?.name}</div>
                    ) : (
                        <div>Back to {activeFolder.name}</div>
                    )}
                </Link>

                <div className="flex flex-col gap-4 border-b pb-5 sm:flex-row sm:items-start sm:justify-between">
                    <div className="space-y-2">
                        <h1 className="text-xl font-semibold tracking-tight">
                            {topic.label}
                        </h1>
                        <div className="flex flex-wrap gap-1.5">
                            {activeFolder.job_position && (
                                <Badge
                                    variant="secondary"
                                    className="text-xs font-normal"
                                >
                                    {activeFolder.job_position.name}
                                </Badge>
                            )}
                            <Badge
                                variant="outline"
                                className="text-xs font-normal"
                            >
                                {activeFolder.name}
                            </Badge>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            onClick={() =>
                                router.visit(
                                    `/admin/folders/${activeFolder.slug}/preview?topic=${topic.slug}`,
                                )
                            }
                        >
                            <Eye className="mr-2 h-4 w-4" />
                            Preview
                        </Button>
                        <Button onClick={() => setUploadOpen(true)}>
                            <Upload className="mr-2 h-4 w-4" />
                            Upload Slides
                        </Button>
                    </div>
                </div>

                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <h2 className="text-sm font-medium text-muted-foreground">
                            Slides
                        </h2>
                        <span className="text-xs text-muted-foreground">
                            {slides.length}{" "}
                            {slides.length === 1 ? "slide" : "slides"}
                        </span>
                    </div>
                    <SlideGrid slides={slides} folderId={activeFolder.id} />
                </div>
            </div>

            <UploadSlidesDialog
                open={uploadOpen}
                onClose={() => setUploadOpen(false)}
                folderId={activeFolder.id}
                topicId={topic.id}
            />
        </>
    );
}

Index.layout = (page: React.ReactNode) => <Master>{page}</Master>;

export default Index;
