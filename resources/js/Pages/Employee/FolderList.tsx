import { Head, router } from "@inertiajs/react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import FolderModuleCard, {
    type OrientationFolder,
} from "./components/folder/FolderModuleCard";
import Header from "./components/folder/Header";
import type { OnboardingUser } from "./Types";
import EmployeeLayout from "@/Layout/EmployeeLayout";
interface Props {
    folders: OrientationFolder[];
    allCompleted: boolean;
    user: OnboardingUser;
}

export default function FolderList({ folders, allCompleted, user }: Props) {
    const completedCount = folders.filter((f) => f.completed).length;
    const progress = folders.length
        ? (completedCount / folders.length) * 100
        : 0;

    function handleContinue() {
        router.visit("/orientation/acknowledgement");
    }

    return (
        <EmployeeLayout>
            <div className="space-y-10">
                <Header user={user} />
                <div className="mb-8 space-y-4">
                    <div>
                        <h1 className="text-3xl tracking-tight">
                            Orientation Modules
                        </h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Complete each topic in sequence. Finish all{" "}
                            {folders.length} to move on to your final
                            acknowledgement.
                        </p>
                    </div>

                    {/*  <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                            <span className="font-medium">
                                {completedCount} of {folders.length} completed
                            </span>
                            <div className="text-muted-foreground ">
                                {Math.round(progress)}%
                            </div>
                        </div>
                        <Progress value={progress} className="h-2" />
                    </div> */}
                </div>

                <div className="grid flex-1 gap-6 content-start sm:grid-cols-2 lg:grid-cols-3">
                    {folders.map((folder, index) => (
                        <FolderModuleCard
                            key={folder.id}
                            folder={folder}
                            index={index}
                        />
                    ))}
                </div>

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
        </EmployeeLayout>
    );
}
