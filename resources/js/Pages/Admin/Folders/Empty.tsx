import { FolderOpen, Image, Video, ListTree, CirclePlus } from "lucide-react";
import Master from "@/Layout/Master";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

export default function EmptyWorkspace() {
    return (
        <Master>
            <div className="flex h-full items-center justify-center">
                <div className="max-w-4xl text-center">
                    <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-primary/10">
                        <FolderOpen className="size-10 text-primary" />
                    </div>

                    <h1 className="mt-8 text-3xl font-bold tracking-tight">
                        Presentation Workspace
                    </h1>

                    <p className="mt-3 text-muted-foreground">
                        Select a module from the presentation panel to start
                        managing its topics and presentation materials.
                    </p>

                    <Button className="mt-8 gap-2">
                        <CirclePlus className="size-4" />
                        Create Module
                    </Button>

                    <div className="mt-14 grid grid-cols-3 gap-6 text-left">
                        <Card>
                            <CardHeader>
                                <div className="mb-3 text-primary">
                                    <ListTree />
                                </div>
                                <CardTitle className="font-medium">
                                    Topics
                                </CardTitle>

                                <CardDescription className="mt-1 text-sm text-muted-foreground">
                                    Organize presentation topics
                                </CardDescription>
                            </CardHeader>
                        </Card>
                        <Card>
                            <CardHeader>
                                <div className="mb-3 text-primary">
                                    <Image />
                                </div>
                                <CardTitle className="font-medium">
                                    Images
                                </CardTitle>

                                <CardDescription className="mt-1 text-sm text-muted-foreground">
                                    Upload presentation images
                                </CardDescription>
                            </CardHeader>
                        </Card>
                        <Card>
                            <CardHeader>
                                <div className="mb-3 text-primary">
                                    <Video />
                                </div>
                                <CardTitle className="font-medium">
                                    Videos
                                </CardTitle>

                                <CardDescription className="mt-1 text-sm text-muted-foreground">
                                    Attach training videos
                                </CardDescription>
                            </CardHeader>
                        </Card>
                    </div>
                </div>
            </div>
        </Master>
    );
}
