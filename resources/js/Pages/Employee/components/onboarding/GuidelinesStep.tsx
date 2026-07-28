import { useState } from "react";
import { Link } from "@inertiajs/react";
import OnboardingHeader from "./OnboardingHeader";
import { motion } from "motion/react";

import { cn } from "@/lib/utils";
const guideSections = [
    {
        title: "Orientation Requirements",

        description:
            "These requirements must be completed before your onboarding can be considered successful.",
        items: [
            {
                title: "Complete Your Orientation on Time",
                description:
                    "Finish all assigned orientation modules within 24–48 hours of receiving access unless instructed otherwise by Human Resources.",
            },
            {
                title: "Complete All Assigned Modules",
                description:
                    "Only the modules assigned to your company and position are required, but every assigned module must be completed before your orientation is considered finished.",
            },
            {
                title: "Provide Your Electronic Signature",
                description:
                    "Once every required module has been completed, you'll be asked to submit your electronic signature to officially acknowledge your orientation.",
            },
        ],
    },
    {
        title: "Learning Expectations",

        description:
            "Make the most of your orientation by reviewing each learning material carefully.",
        items: [
            {
                title: "Review Every Learning Module",
                description:
                    "Carefully read each presentation and learning material. These modules contain essential information about the company, your role, and workplace expectations.",
            },
            {
                title: "Mark Modules Truthfully",
                description:
                    "Only confirm a module as completed after you have finished reviewing its contents. Completion records serve as your acknowledgement.",
            },
            {
                title: "Upload Your Employee Photo",
                description:
                    "Some orientations may require you to upload a profile photo for identification and onboarding records.",
            },
        ],
    },
    {
        title: "Professional Conduct",

        description:
            "These guidelines help protect company information and ensure a professional onboarding experience.",
        items: [
            {
                title: "Maintain Professional Conduct",
                description:
                    "The orientation materials are intended for internal company use. Please review them responsibly and professionally.",
            },
            {
                title: "Do Not Share Company Materials",
                description:
                    "Orientation presentations, policies, and internal documents must not be copied, distributed, or shared outside the organization.",
            },
            {
                title: "Report Technical Issues Promptly",
                description:
                    "If you encounter any technical problems while completing your orientation, notify Human Resources or your assigned administrator immediately.",
            },
        ],
    },
    {
        title: "Acknowledgement",

        description:
            "By continuing, you confirm your understanding of the orientation process and company expectations.",
        items: [
            {
                title: "Acceptance of Company Policies",
                description:
                    "By proceeding with this orientation, you acknowledge that you have read, understood, and agree to comply with the company's onboarding requirements and workplace policies.",
            },
        ],
    },
];

const container = {
    hidden: {},
    show: {
        transition: {
            staggerChildren: 0.1,
        },
    },
};

const item = {
    hidden: {
        opacity: 0,
        x: -10,
    },
    show: {
        opacity: 1,
        x: 0,
    },
};
export default function GuidelinesStep({}) {
    const [agreed, setAgreed] = useState(false);
    return (
        <div className="flex h-full flex-col">
            <OnboardingHeader />
            <div className="flex flex-1 min-h-0 flex-col px-6 md:px-10 lg:px-14  space-y-10 rounded-3xl">
                <div className="flex flex-col gap-2">
                    <h1 className="text-[40px]/snug font-light tracking-tight">
                        Before you begin.
                    </h1>
                    <p className="text-muted-foreground leading-7">
                        Please review the following guidelines carefully before
                        starting your orientation. These help ensure a smooth
                        onboarding experience and establish the expectations for
                        completing NEO.
                    </p>
                </div>

                <div className="flex-1 overflow-y-auto rounded-3xl bg-muted p-10 shadow-lg">
                    <motion.div className="space-y-10">
                        {guideSections.map((section) => (
                            <motion.div
                                key={section.title}
                                initial={{
                                    opacity: 0,
                                    y: 24,
                                }}
                                whileInView={{
                                    opacity: 1,
                                    y: 0,
                                }}
                                viewport={{
                                    once: true,
                                    amount: 0.2,
                                }}
                                transition={{
                                    duration: 0.45,
                                    ease: [0.22, 1, 0.36, 1],
                                }}
                                className="space-y-5"
                            >
                                <div>
                                    <h2 className="text-lg font-semibold tracking-tight">
                                        {section.title}
                                    </h2>

                                    <p className="mt-1 text-sm text-muted-foreground">
                                        {section.description}
                                    </p>
                                </div>

                                <motion.div
                                    variants={container}
                                    initial="hidden"
                                    whileInView="show"
                                    className="space-y-4"
                                >
                                    {section.items.map((guide, index) => (
                                        <motion.div
                                            variants={item}
                                            key={guide.title}
                                            className="flex gap-4 border-l-2 border-primary/20 pl-5"
                                        >
                                            <motion.div
                                                className="space-y-1"
                                                whileHover={{
                                                    x: 6,
                                                }}
                                            >
                                                <h3 className="font-medium">
                                                    {guide.title}
                                                </h3>

                                                <p className="text-sm leading-6 text-muted-foreground">
                                                    {guide.description}
                                                </p>
                                            </motion.div>
                                        </motion.div>
                                    ))}
                                </motion.div>
                            </motion.div>
                        ))}
                    </motion.div>
                    <div className="mt-8 rounded-2xl border bg-background p-5">
                        <label className="flex items-start gap-4">
                            <input
                                type="checkbox"
                                checked={agreed}
                                onChange={(e) => setAgreed(e.target.checked)}
                                className="mt-1"
                            />

                            <div>
                                <p className="font-medium">
                                    I acknowledge these guidelines
                                </p>

                                <p className="mt-1 text-sm text-muted-foreground leading-6">
                                    I have read, understood, and agree to comply
                                    with the NEO Orientation Guidelines before
                                    proceeding with my assigned orientation.
                                </p>
                            </div>
                        </label>
                    </div>
                </div>

                <Link href="/orientation/folders" className="py-8">
                    <button
                        disabled={!agreed}
                        className="rounded-2xl border px-6 py-3 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Begin Orientation
                    </button>
                </Link>
            </div>
        </div>
    );
}

/* /orienation/folders for linking to modules */
