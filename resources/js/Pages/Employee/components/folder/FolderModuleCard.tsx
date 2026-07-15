import { Link } from '@inertiajs/react'
import { Lock, CheckCircle2, Files } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface OrientationFolder {
    id: number
    slug: string
    name: string
    slide_count: number
    completed: boolean
    locked: boolean
}

interface Props {
    folder: OrientationFolder
    index: number
}

export default function FolderModuleCard({ folder, index }: Props) {
    const content = (
        <div
            className={cn(
                'group relative flex h-full flex-col justify-between overflow-hidden rounded-2xl border p-5 transition-all',
                folder.locked
                    ? 'cursor-not-allowed border-border/60 bg-muted/30'
                    : folder.completed
                      ? 'border-emerald-200 bg-emerald-50/60 hover:shadow-md dark:border-emerald-900 dark:bg-emerald-950/20'
                      : 'border-border bg-card hover:-translate-y-0.5 hover:shadow-lg'
            )}
        >
            {/* Folder tab shape */}
            <div
                className={cn(
                    'absolute -top-2 left-5 h-4 w-12 rounded-t-md',
                    folder.locked
                        ? 'bg-muted-foreground/10'
                        : folder.completed
                          ? 'bg-emerald-200 dark:bg-emerald-900'
                          : 'bg-primary/15'
                )}
            />

            <div className="relative">
                <div className="flex items-start justify-between">
                    <div
                        className={cn(
                            'flex h-11 w-11 items-center justify-center rounded-xl',
                            folder.locked
                                ? 'bg-muted-foreground/10 text-muted-foreground/50'
                                : folder.completed
                                  ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900 dark:text-emerald-400'
                                  : 'bg-primary/10 text-primary'
                        )}
                    >
                        {folder.locked ? (
                            <Lock className="h-5 w-5" />
                        ) : folder.completed ? (
                            <CheckCircle2 className="h-5 w-5" />
                        ) : (
                            <Files className="h-5 w-5" />
                        )}
                    </div>

                    <span
                        className={cn(
                            'flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold',
                            folder.locked
                                ? 'bg-muted text-muted-foreground/50'
                                : folder.completed
                                  ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300'
                                  : 'bg-muted text-muted-foreground'
                        )}
                    >
                        {index + 1}
                    </span>
                </div>

                <h3
                    className={cn(
                        'mt-4 line-clamp-2 text-sm font-semibold leading-snug',
                        folder.locked ? 'text-muted-foreground/60' : 'text-foreground'
                    )}
                >
                    {folder.name}
                </h3>
            </div>

            <div className="relative mt-4 flex items-center justify-between">
                <p
                    className={cn(
                        'text-xs',
                        folder.locked ? 'text-muted-foreground/50' : 'text-muted-foreground'
                    )}
                >
                    {folder.slide_count} {folder.slide_count === 1 ? 'slide' : 'slides'}
                </p>

                {folder.completed && !folder.locked && (
                    <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                        Completed
                    </span>
                )}
                {folder.locked && (
                    <span className="text-xs font-medium text-muted-foreground/50">
                        Locked
                    </span>
                )}
            </div>
        </div>
    )

    if (folder.locked) {
        return <div>{content}</div>
    }

    return (
        <Link href={`/orientation/folders/${folder.slug}`} className="block h-full">
            {content}
        </Link>
    )
}