import { useState } from "react";
import { Rotate3d } from "lucide-react";
import { Link } from "@inertiajs/react";

const guides = [
    {
        title: "Complete Your Orientation on Time",
        description:
            "Finish all assigned orientation modules within 24-48 hours upon  receiving access unless instructed otherwise by Human Resources.",
    },
    {
        title: "Review Every Learning Module",
        description:
            "Carefully read each presentation and learning material. These modules contain essential information about the company, your role, and workplace expectations.",
    },
    {
        title: "Complete All Assigned Modules",
        description:
            "Only the modules assigned to your company and position are required, but every assigned module must be completed before your orientation is considered finished.",
    },
    {
        title: "Mark Modules Truthfully",
        description:
            "Only confirm a module as completed after you have finished reviewing its contents. Completion records serve as your acknowledgement.",
    },
    {
        title: "Provide Your Electronic Signature",
        description:
            "Once every required module has been completed, you'll be asked to submit your electronic signature to officially acknowledge your orientation.",
    },
    {
        title: "Upload Your Employee Photo",
        description:
            "Some orientations may require you to upload a profile photo for identification and onboarding records.",
    },
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
    {
        title: "Acknowledgement of Company Policies",
        description:
            "By proceeding with this orientation, you acknowledge that you have read, understood, and agree to comply with the company's onboarding requirements and workplace policies.",
    },
];
export default function GuidelinesStep({}) {
    const [agreed, setAgreed] = useState(false);
    return (
        <div className="flex h-full flex-col">
            <div className="flex gap-2 items-center px-6 py-6">
                <Rotate3d absoluteStrokeWidth strokeWidth={1.5} size={22} />
                <p className="">NEO</p>
            </div>

            <div className="flex flex-1 min-h-0 flex-col px-14 space-y-10">
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

                <div className="flex-1 overflow-y-auto rounded-3xl bg-muted p-10 shadow-lg ">
                    <div className="space-y-5">
                        {guides.map((guide, index) => (
                            <div
                                key={guide.title}
                                className="group flex gap-5 rounded-2xl border border-border/60 bg-background p-5 transition-all duration-200 hover:border-primary/20 hover:shadow-md"
                            >
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold">
                                    {String(index + 1).padStart(2, "0")}
                                </div>

                                <div className="space-y-2">
                                    <h3 className="font-medium tracking-tight">
                                        {guide.title}
                                    </h3>

                                    <p className="text-sm leading-6 text-muted-foreground">
                                        {guide.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
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
                <div className="py-8">
                    <Link href="/orientation/folders">
                        <button
                            disabled={!agreed}
                            className="rounded-2xl border px-6 py-3 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            Begin Orientation
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
}

/* /orienation/folders for linking to modules */
