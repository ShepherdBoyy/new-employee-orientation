import { Head, router } from "@inertiajs/react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import FolderModuleCard, {
    type OrientationFolder,
} from "./components/folder/FolderModuleCard";
import Header from "./components/folder/Header";
interface Props {
    folders: OrientationFolder[];
    allCompleted: boolean;
}

export default function FolderList({ folders, allCompleted }: Props) {
    const completedCount = folders.filter((f) => f.completed).length;
    const progress = folders.length
        ? (completedCount / folders.length) * 100
        : 0;

    function handleContinue() {
        router.visit("/orientation/acknowledgement");
    }

    return (
        <>
            <Head title="Orientation Modules" />

            <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-6 py-10 font-poppins">
                <Header />
                {/* Header */}
                <div className="mb-8 space-y-4">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">
                            Orientation Modules
                        </h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Complete each module in order. Finish all{" "}
                            {folders.length} to move on to your final
                            acknowledgement.
                        </p>
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                            <span className="font-medium">
                                {completedCount} of {folders.length} completed
                            </span>
                            <span className="text-muted-foreground">
                                {Math.round(progress)}%
                            </span>
                        </div>
                        <Progress value={progress} className="h-2" />
                    </div>
                </div>

                {/* Grid — 3 columns, max 8 (3x3 with one gap) */}
                <div className="grid flex-1 grid-cols-1 gap-4 content-start sm:grid-cols-2 lg:grid-cols-3">
                    {folders.map((folder, index) => (
                        <FolderModuleCard
                            key={folder.id}
                            folder={folder}
                            index={index}
                        />
                    ))}
                </div>

                {/* Continue to acknowledgement */}
                {allCompleted && (
                    <div className="mt-8 flex flex-col items-center gap-3 rounded-2xl border bg-muted/30 p-6 text-center">
                        <p className="text-sm font-medium">
                            You've completed all modules. You're ready for the
                            final step.
                        </p>
                        <Button onClick={handleContinue}>
                            Continue to Acknowledgement
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </div>
                )}
            </div>
        </>
    );
}
