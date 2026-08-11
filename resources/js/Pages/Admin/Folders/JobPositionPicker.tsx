import { motion } from "motion/react";
import JobPositionListItem, {
    type PickerPosition,
} from "./components/JobPositionListItem";
import Master from "@/Layout/Master";

interface CompanyType {
    id: number;
    name: string;
    slug: string;
}

interface Props {
    company: CompanyType;
    positions: PickerPosition[];
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
function JobPositionPicker({ company, positions }: Props) {
    return (
        <>
            <motion.div
                initial="hidden"
                animate="visible"
                variants={pageVariants}
                className="mx-auto w-full space-y-6"
            >
                <motion.header
                    variants={itemVariants}
                    className="border-b pb-6"
                >
                    <div className="flex items-center justify-between gap-6">
                        <div className="flex min-w-0 items-center gap-4">
                            <motion.div
                                className="flex size-18 shrink-0 items-center justify-center rounded-2xl  p-2.5 text-primary"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{
                                    duration: 0.4,
                                    ease: "easeOut",
                                }}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 192 168"
                                >
                                    <path d="M116.5 11 84 21.5a307 307 0 0 1-27.5 8.1c-6.4.7-35.7 10.3-40 13.1-5.3 3.6-6.5 5.1-6.5 8.6 0 4.4 33.8 102.8 36.2 105.4 1.1 1.2 3.1 2.4 4.4 2.7 3 .8 4.5.3 53.4-16.4l56.4-19.2c9.8-3.3 18.7-6.9 19.7-7.9a8 8 0 0 0 1.9-5.4c0-1.9-3.9-14.6-8.6-28.2l-14.9-42.9c-3.5-10-6.8-19-7.4-20.1-1.7-3.2-6.2-4.6-10.7-3.4-5.6 1.6-5.9 1.5-7.2-2.2-1-2.9-4.7-5.8-7-5.6-.4 0-4.7 1.3-9.7 2.9m13.5 4c.7 1.7 1.1 3.2.9 3.4s-13.7 4.4-29.9 9.5-31.1 9.9-33 10.9c-2.7 1.3-3.7 2.6-4.4 5.5l-1 3.7-16.9 5.5c-16 5.2-17 5.4-18.3 3.8-.7-1-1.4-2.3-1.4-2.9 0-.5-1.3-3.1-3-5.7-1.6-2.5-2.6-4.8-2.2-5.1.7-.4 18.6-6 30-9.3l5.3-1.6 2.7 2.6c1.6 1.5 3.6 2.7 4.5 2.7q3.4.2-.5-3-2.1-1.7-1.8-2.2c1.3-1.1 62.8-20.7 65.1-20.7 2-.1 3 .6 3.9 2.9m17.7 5.2c.6.7 2.6 6 4.6 11.8s8.7 25.6 15.2 44c7 20.4 11.4 34.3 11.1 35.6a5 5 0 0 1-2.3 2.9c-8.6 3.4-122 41.5-123.7 41.5-1.3 0-3-.8-3.8-1.8C46 151 12.7 52.5 13.5 49.9c.8-2.4 3.5-2.5 3.5-.1 0 1 7.5 23.6 16.6 50.3l17.7 51.6c1 3.1 2.7 4.5 2.7 2.3 0-.6-7.9-24.3-17.5-52.7-16.3-47.8-20.4-62-14.2-48.3 4.4 9.8 3.8 9.7 22.7 3.9 17.7-5.4 21-6.9 21-9.7 0-4.4 2.6-5.5 38.6-16.8a621 621 0 0 1 39-11.4c1.7 0 3.6.6 4.1 1.2" />
                                </svg>
                            </motion.div>

                            <div className="min-w-0">
                                <motion.h1
                                    className="truncate text-2xl font-semibold tracking-tight"
                                    variants={itemVariants}
                                >
                                    Module 5 — Job-Specific Training
                                </motion.h1>

                                <motion.p
                                    variants={itemVariants}
                                    className="mt-1 text-sm text-muted-foreground"
                                >
                                    Manage training content tailored to each job
                                    position.
                                </motion.p>
                            </div>
                        </div>
                    </div>
                </motion.header>
                <motion.section variants={itemVariants} className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-lg font-semibold">
                                Job Positions
                            </h2>

                            <p className="text-sm text-muted-foreground">
                                Select a position to manage its specific
                                training content.
                            </p>
                        </div>

                        <span className="text-sm text-muted-foreground"></span>
                    </div>
                </motion.section>

                <div className="space-y-2">
                    {positions.map((position, index) => (
                        <JobPositionListItem
                            key={position.id}
                            companyId={company.id}
                            position={position}
                            index={index}
                        />
                    ))}
                </div>
            </motion.div>
        </>
    );
}
JobPositionPicker.layout = (page: React.ReactNode) => <Master>{page}</Master>;

export default JobPositionPicker;
