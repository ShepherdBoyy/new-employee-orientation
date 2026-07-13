import { type ReactNode } from 'react'

interface Props {
    title: string
    description?: ReactNode
    actions?: ReactNode
}

export default function FolderPageHeader({ title, description, actions }: Props) {
    return (
        <div className="flex flex-col gap-4 border-b pb-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
                <h1 className="text-xl font-semibold tracking-tight">{title}</h1>
                {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
            </div>
            {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
        </div>
    )
}