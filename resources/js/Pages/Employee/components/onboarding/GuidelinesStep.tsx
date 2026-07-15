import { useState } from "react";
import { Rotate3d } from "lucide-react";
import { Link } from "@inertiajs/react";

const guides = [
    {
        title: "Complete all assigned modules",
        description:
            "All modules assigned to your company and position must be completed before your orientation can be considered finished.",
    },
    {
        title: "Review every presentation carefully",
        description:
            "Take the time to go through each slide and learning material. The information provided is intended to help you understand our company, policies, and your role.",
    },
    {
        title: "Confirm each completed module",
        description:
            "After reviewing a module, mark it as completed only when you have finished reading and understood its contents.",
    },
    {
        title: "Submit your electronic signature",
        description:
            "Once all required modules have been completed, you will be asked to provide your electronic signature to acknowledge completion of your orientation.",
    },
    {
        title: "Complete your orientation within one (1) day",
        description:
            "Your orientation should be completed within one (1) day from the time it is assigned. If you experience technical issues or require assistance, please contact Human Resources immediately.",
    },
];

export default function GuidelinesStep({}) {
    const [agreed, setAgreed] = useState(false);
    return (
        <div className="flex flex-col">
            <div className="flex gap-2 items-center px-6 py-6">
                <Rotate3d absoluteStrokeWidth strokeWidth={1.5} size={22} />
                <p className="">NEO</p>
            </div>

            <div className="space-y-8 px-14">
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

                <div className="space-y-6">
                    {guides.map((guide, index) => (
                        <div
                            key={guide.title}
                            className="border-b pb-6 last:border-b-0"
                        >
                            <div className="flex gap-4">
                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">
                                    {index + 1}
                                </div>

                                <div className="space-y-1">
                                    <h3 className="font-medium">
                                        {guide.title}
                                    </h3>

                                    <p className="text-sm leading-6 text-muted-foreground">
                                        {guide.description}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                    <label className="flex items-start gap-3">
                        <input
                            type="checkbox"
                            checked={agreed}
                            onChange={(e) => setAgreed(e.target.checked)}
                            className="mt-1"
                        />

                        <span className="text-sm text-muted-foreground leading-6">
                            I have read, understood, and agree to comply with
                            the NEO Orientation Guidelines.
                        </span>
                    </label>
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

                {/*   <div className="space-y-10 divide-y">
                    {guides.map((item, index) => (
                        <p key={index}>{item.description}</p>
                    ))}
                </div> */}
            </div>
        </div>
    );
}

/* /orienation/folders for linking to modules */
