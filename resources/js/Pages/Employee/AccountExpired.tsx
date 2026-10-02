import { CalendarClock, Mail } from "lucide-react";
export default function AccountExpired() {
    return (
        <div className="flex items-center  min-h-screen justify-center bg-linear-to-br from-slate-950 via-slate-900 to-slate-800 text-white lg:flex">
            <div className="w-full max-w-5xl ">
                <h1 className="mt-6 max-w-xl text-5xl font-medium leading-[1.15] tracking-tight xl:text-6xl">
                    Your account has expired
                </h1>
                <p className="mt-2 text-base leading-relaxed text-white/60">
                    Access to this orientation is only available for 2 days
                    after your account was created.
                </p>

                <div className="mt-8 flex items-start gap-3 rounded-2xl border bg-card p-5 text-left shadow-sm">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <Mail className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                        <p className="text-sm font-medium text-black">
                            Need access again?
                        </p>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                            Please reach out to your company's administrator or
                            HR representative directly. They will be able to
                            assist you further.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
