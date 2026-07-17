import { Building2, BriefcaseBusiness, Sparkles } from "lucide-react";
import type { OnboardingUser } from "../../Types";

type Props = {
    user: OnboardingUser;
};

export default function Header({ user }: Props) {
    return (
        <div className="relative overflow-hidden rounded-2xl border bg-linear-to-r from-slate-900 via-slate-800 to-slate-900 text-white">
            <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-sky-500/10 blur-3xl" />
            <div className="absolute -bottom-24 left-0 h-72 w-72 rounded-full bg-indigo-500/10 blur-3xl" />

            <div className="relative flex flex-col gap-8 p-8 md:flex-row md:items-center md:justify-between">
                <div className="space-y-4">
                    <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-sm backdrop-blur">
                        <Sparkles
                            className="h-4 w-4 text-yellow-300"
                            absoluteStrokeWidth
                        />
                        Welcome to your onboarding
                    </div>

                    <div className="space-y-2">
                        <h1 className="text-[40px]  tracking-tight">
                            Hi, {user.name} ! 👋
                        </h1>

                        <p className="text-slate-300 leading-7">
                            Start exploring your orientation modules and the
                            resources we've set up for your role.
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-3 pt-2">
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
                    </div>
                </div>
            </div>
        </div>
    );
}
