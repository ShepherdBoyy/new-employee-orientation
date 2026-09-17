import { Building2, BriefcaseBusiness, FileText, Sparkles } from "lucide-react";
import type { OnboardingUser } from "../../Types";
import { useState } from "react";

type Props = {
    user: OnboardingUser;
};

export default function Header({ user }: Props) {
    const [hasClicked, setHasClicked] = useState(false);

    return (
        <div className="relative overflow-hidden rounded-2xl border bg-linear-to-r from-slate-900 via-slate-800 to-slate-900 text-white">
            <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-sky-500/10 blur-3xl" />
            <div className="absolute -bottom-24 left-0 h-72 w-72 rounded-full bg-indigo-500/10 blur-3xl" />

            <div className="relative flex flex-col gap-8 p-6 lg:p-8 md:flex-row md:items-center md:justify-between">
                <div className=" space-y-6 lg:space-y-4">
                    <div>
                        <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-sm backdrop-blur">
                            <Sparkles
                                className="h-4 w-4 text-yellow-300"
                                absoluteStrokeWidth
                            />
                            Welcome to your onboarding
                        </div>
                    </div>

                    <div className="space-y-2">
                        <h1 className="text-2xl lg:text-[40px]  lg:tracking-tight">
                            Hi, {user.name} ! 👋
                        </h1>

                        <p className="text-slate-300 leading-7 text-sm lg:text-base">
                            Start exploring your orientation modules and the
                            resources we've set up for your role.
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-3 lg:pt-2">
                        <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2 backdrop-blur">
                            <BriefcaseBusiness className="h-4 w-4 text-sky-400" />
                            <span className="text-sm font-light">
                                {user.jobPosition}
                            </span>
                        </div>

                        <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2 backdrop-blur">
                            <Building2 className="h-4 w-4 text-emerald-400" />
                            <span className="text-sm font-light">
                                {user.companyName}
                            </span>
                        </div>
                        {user.jd_path && 
                            <a href={`/storage/${user?.jd_path}`} target="_blank">
                                <div 
                                    onClick={() => setHasClicked(true)}
                                    className="relative flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2 backdrop-blur cursor-pointer select-none"
                                >
                                    <FileText className="h-4 w-4 text-mist-50" />
                                    <span className="text-sm font-light">
                                        Job Description/KPI
                                    </span>
                                    
                                    {/* Pinging indicator (only shows if hasClicked is false) */}
                                    {!hasClicked && (
                                        <span className="absolute -top-1 -right-1 flex size-3">
                                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-75"></span>
                                            <span className="relative inline-flex size-3 rounded-full bg-sky-500"></span>
                                        </span>
                                    )}
                                </div>
                            </a>
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}
