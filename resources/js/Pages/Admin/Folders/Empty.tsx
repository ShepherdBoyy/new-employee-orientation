import { FolderOpen, Image, Video, ListTree, CirclePlus } from "lucide-react";
import Master from "@/Layout/Master";
import { Button } from "@/components/ui/button";

function Empty({}) {
    return (
        <div className="flex h-full items-center justify-center">
            <div className="max-w-2xl text-center">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-primary/10">
                    <FolderOpen className="size-10 text-primary" />
                </div>

                <h1 className="mt-8 text-3xl font-bold tracking-tight">
                    Presentation Workspace
                </h1>

                <p className="mt-3 text-muted-foreground">
                    Choose a module from the panel to manage your topics,
                    slides, and learning materials, or create a new one to get
                    started.
                </p>

                <Button className="mt-8 gap-2" size="lg">
                    <CirclePlus className="size-4" />
                    Create Module
                </Button>
            </div>
        </div>
    );
}

Empty.layout = (page: React.ReactNode) => <Master>{page}</Master>;
export default Empty;
