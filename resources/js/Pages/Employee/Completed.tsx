import { Head, Link } from '@inertiajs/react'
import { CheckCircle2, ShieldCheck, Folder, Check } from 'lucide-react'

interface FolderSummary {
    id: number
    slug: string
    name: string
    slide_count: number
    completed: boolean
}

interface Props {
    user: { name: string }
    acknowledgedAt: string
    folders: FolderSummary[]
}

export default function Completed({ user, acknowledgedAt, folders }: Props) {
    return (
        <>
            <Head title="Orientation Completed" />

            <div className="mx-auto flex min-h-screen w-full max-w-3xl flex-col items-center justify-center px-6 py-14 font-poppins">
                {/* Success header */}
                <div className="w-full max-w-md text-center">
                    <div className="relative mx-auto mb-6 flex h-16 w-16 items-center justify-center">
                        <div className="absolute inset-0 animate-pulse rounded-full bg-emerald-500/15" />
                        <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-linear-to-b from-emerald-400 to-emerald-600 shadow-lg shadow-emerald-500/25">
                            <CheckCircle2 className="h-7 w-7 text-white" strokeWidth={2.25} />
                        </div>
                    </div>

                    <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                        You're all set, {user.name.split(' ')[0]}!
                    </h1>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                        Your orientation has been completed and officially acknowledged.
                    </p>

                    <div className="mt-7 flex items-center gap-3 rounded-2xl border bg-card/60 p-4 text-left shadow-sm backdrop-blur-sm">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                            <ShieldCheck className="h-4 w-4" />
                        </div>
                        <div className="min-w-0">
                            <p className="text-sm font-medium leading-none">Acknowledgement recorded</p>
                            <p className="mt-1 text-xs text-muted-foreground">{acknowledgedAt}</p>
                        </div>
                    </div>
                </div>

                {/* Modules grid: 4 columns x 2 rows (max 8) */}
                {folders.length > 0 && (
                    <div className="mt-10 w-full">
                        <p className="mb-4 text-center text-xs font-medium uppercase tracking-wide text-muted-foreground">
                            Review your modules
                        </p>
                        <div className="grid grid-cols-2 gap-x-3 gap-y-6 sm:grid-cols-4">
                            {folders.map((folder) => (
                                <Link
                                    key={folder.id}
                                    href={`/orientation/folders/${folder.slug}`}
                                    className="group flex flex-col items-center gap-2 rounded-xl px-2 py-3 text-center transition hover:bg-muted/50"
                                >
                                    <div className="relative flex h-16 w-16 items-center justify-center">
                                        <Folder
                                            className="h-16 w-16 fill-primary/10 text-muted-foreground/60 transition duration-200 group-hover:-translate-y-0.5 group-hover:fill-primary/15 group-hover:text-primary/70"
                                            strokeWidth={1.5}
                                        />
                                        {folder.completed && (
                                            <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 ring-2 ring-background">
                                                <Check className="h-3 w-3 text-white" strokeWidth={3} />
                                            </span>
                                        )}
                                    </div>

                                    <div className="min-w-0">
                                        <p className="line-clamp-2 text-xs font-medium leading-snug text-foreground">
                                            {folder.name}
                                        </p>
                                        <p className="mt-0.5 text-[11px] text-muted-foreground/70">
                                            {folder.slide_count} {folder.slide_count === 1 ? 'slide' : 'slides'}
                                        </p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

                <p className="mt-10 text-center text-xs text-muted-foreground">
                    A copy of this record has been securely stored. Your administrator has been notified.
                </p>
            </div>
        </>
    )
}