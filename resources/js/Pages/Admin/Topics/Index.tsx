import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, ArrowLeft } from "lucide-react";
import { Link } from "@inertiajs/react";
import { motion } from "motion/react";
import AddTopicDialog from "@/Pages/Admin/Topics/component/Dialogs/AddTopicDialog";
import TopicCard from "./component/TopicCard";
import Master from "@/Layout/Master";
import FolderIcon from "./component/FolderIcon";
import { Company } from "../Types/company";
import type { Topic } from "./component/TopicCard";
import type { Folder } from "../Slides/Index";
import DeleteTopicDialog from "./component/Dialogs/DeleteTopicDialog";
import EditTopicDialog from "./component/Dialogs/EditTopicDialog";
import TopicList from "./component/TopicList";
interface Props {
    company: Company;
    topics: Topic[];
    activeFolder: Folder;
}

const pageVariants = {
    hidden: {
        opacity: 0,
    },
    visible: {
        opacity: 1,
        transition: {
            duration: 0.35,
            staggerChildren: 0.08,
        },
    },
};

const itemVariants = {
    hidden: {
        opacity: 0,
        y: 12,
    },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.4,
            ease: "easeOut",
        },
    },
};
function Index({ topics, company, activeFolder }: Props) {
    const [openAddDialog, setOpenAddDialog] = useState(false);

    const isJobSpecific = activeFolder.is_job_specific;

    const title = isJobSpecific
        ? (activeFolder.job_position?.name ?? "Job-Specific Training")
        : activeFolder.name;

    return (
        <motion.div
            className="space-y-8"
            variants={pageVariants}
            initial="hidden"
            animate="visible"
        >
            {isJobSpecific && (
                <motion.div variants={itemVariants}>
                    <Link
                        href={`/admin/folders/${company.slug}/job-positions`}
                        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                        <ArrowLeft className="size-4" />
                        Back to Job Positions
                    </Link>
                </motion.div>
            )}

            <motion.header variants={itemVariants} className="border-b pb-6">
                <div className="flex items-center justify-between gap-6">
                    <div className="flex min-w-0 items-center gap-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{
                                duration: 0.4,
                                ease: "easeOut",
                            }}
                        >
                            <FolderIcon jobSpecific={isJobSpecific} />
                        </motion.div>

                        <div className="min-w-0">
                            <motion.h1
                                variants={itemVariants}
                                className="truncate text-2xl font-semibold tracking-tight"
                            >
                                {title}
                            </motion.h1>

                            <motion.p
                                variants={itemVariants}
                                className="mt-1 text-sm text-muted-foreground"
                            >
                                Manage the topics included in this module.
                            </motion.p>
                        </div>
                    </div>

                    <motion.div variants={itemVariants}>
                        <Button
                            size="lg"
                            className="shrink-0"
                            onClick={() => setOpenAddDialog(true)}
                        >
                            <Plus className="size-4" />
                            Add Topic
                        </Button>
                    </motion.div>
                </div>
            </motion.header>
            <motion.section variants={itemVariants} className="space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-semibold">Topics</h2>

                        <p className="text-sm text-muted-foreground">
                            Manage the content included in this module.
                        </p>
                    </div>

                    <span className="text-sm text-muted-foreground">
                        {topics.length}{" "}
                        {topics.length === 1 ? "topic" : "topics"}
                    </span>
                </div>

                <TopicList topics={topics} company={company} folderId={activeFolder.id} />
            </motion.section>

            <AddTopicDialog
                open={openAddDialog}
                onOpenChange={setOpenAddDialog}
                folderId={activeFolder.id}
            />
        </motion.div>
    );
}

Index.layout = (page: React.ReactNode) => <Master>{page}</Master>;
export default Index;
