import { FolderOpen, Image, Video, ListTree, CirclePlus } from "lucide-react";
import Master from "@/Layout/Master";
import { Button } from "@/components/ui/button";

function Empty({}) {
    return (
        <div className="flex h-full items-center justify-center">
            <div className="max-w-2xl text-center">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        aria-label="presentation"
                        viewBox="0 0 180 161"
                    >
                        <path d="M16.3 8.7A9.5 9.5 0 0 0 9 17.9c0 5.4 3.2 9 8.6 9.8l4.1.5.7 44.7c.7 43.4.7 44.6 2.8 46.3 1.8 1.6 4.9 1.8 32.4 1.8H88v6.9c0 6.1-.3 7-2 7.6-2.4.8-5 5.4-5 8.9 0 3.1 4.2 8.2 7.6 9 3.6.9 8.9-1 10.8-3.9 2.4-3.7 2-9.1-.9-12-1.3-1.4-2.9-2.5-3.5-2.5s-1-2.8-1-7v-7h29.4c16.7 0 30.6-.4 32-1l2.6-1v-17.7c0-9.8.3-30.2.7-45.4l.6-27.7 3.8-.6c6.4-1 10-8.7 6.9-14.7-2.7-5-1.6-4.9-79.2-4.8-39.8.1-73.3.4-74.5.6m147.5 5.9c2.6 1.8 2.8 4.6.6 6.8C163 22.8 155 23 90.7 23c-63.8 0-72.5-.2-74.5-1.6-2.4-1.7-2.9-4.6-.9-6.2 2.1-1.7 6.6-1.9 77.7-2 60.6-.2 68.8 0 70.8 1.4m-10.6 56.1c-.2 23.6-.5 43.4-.7 44.1-.6 1.8-123.4 1.8-123.9-.1-.3-.6-.7-20.4-1.1-44L26.9 28h126.6zm-59 70c2.5 2.3 2.3 5-.7 6.9-2.3 1.5-2.7 1.5-5 0-3.1-2-3.2-5-.3-7 2.8-2 3.7-2 6 .1"></path>
                    </svg>
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
