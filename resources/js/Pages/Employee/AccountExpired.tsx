import { Head } from '@inertiajs/react'
import { CalendarClock, Mail } from 'lucide-react'

export default function AccountExpired() {
    return (
        <div className="flex min-h-screen w-full items-center justify-center px-6 py-10">
            <div className="w-full max-w-md text-center">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/40">
                    <CalendarClock className="h-8 w-8 text-amber-600 dark:text-amber-400" />
                </div>

                <h1 className="text-2xl font-semibold tracking-tight">
                    Your orientation window has expired
                </h1>
                <p className="mt-2 text-sm text-muted-foreground">
                    Access to this orientation is only available for 2 days after your account was created.
                    This window has now passed.
                </p>

                <div className="mt-8 flex items-start gap-3 rounded-2xl border bg-card p-5 text-left shadow-sm">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <Mail className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                        <p className="text-sm font-medium">Need access again?</p>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                            Please reach out to your company's administrator or HR representative directly.
                            They will be able to assist you further.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}