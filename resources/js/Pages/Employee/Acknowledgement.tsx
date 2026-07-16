import { useState } from 'react'
import { Head, useForm } from '@inertiajs/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { CheckCircle2, ArrowLeft, ArrowRight, ShieldCheck, Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import SignaturePad from './components/acknowledgement/SignaturePad'
import PhotoCapture from './components/acknowledgement/PhotoCapture'

interface ProgressItem {
    folder_id: number
    folder_name: string
    slide_count: number
    completed: boolean
}

interface Props {
    user: { name: string }
    progress: ProgressItem[]
}

const STEPS = ['Review', 'Name & Signature', 'Photo & Consent'] as const

export default function Acknowledgement({ user, progress }: Props) {
    const [step, setStep] = useState(0)

    const { data, setData, post, processing, errors } = useForm({
        full_name: '',
        signature: '',
        photo: '',
        consented: false as boolean,
    })

    function next() {
        setStep(s => Math.min(s + 1, STEPS.length - 1))
    }

    function back() {
        setStep(s => Math.max(s - 1, 0))
    }

    function handleSubmit() {
        post('/orientation/acknowledgement')
    }

    const canProceedFromName = data.full_name.trim().length > 0
    const canProceedFromSignature = data.signature.length > 0
    const canProceedFromStep1 = canProceedFromName && canProceedFromSignature
    const canSubmit = data.photo.length > 0 && data.consented

    const nameMatches =
        data.full_name.trim().length > 0 &&
        data.full_name.trim().toLowerCase() === user.name.trim().toLowerCase()

    return (
        <>
            <Head title="Final Acknowledgement" />

            <div className="min-h-screen bg-linear-to-b from-muted/40 to-background">
                <div className="mx-auto flex min-h-screen w-full max-w-2xl flex-col px-4 py-8 sm:px-6 sm:py-10">
                    {/* Header */}
                    <div className="mb-6 space-y-1.5 text-center sm:mb-8">
                        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br from-primary/15 to-primary/5 text-primary ring-1 ring-primary/20 sm:h-14 sm:w-14">
                            <ShieldCheck className="h-5 w-5 sm:h-6 sm:w-6" />
                        </div>
                        <p className="text-xs font-medium uppercase tracking-wider text-primary">
                            Orientation
                        </p>
                        <h1 className="text-xl font-bold tracking-tight sm:text-2xl">
                            Final Acknowledgement
                        </h1>
                        <p className="mx-auto max-w-sm text-sm text-muted-foreground">
                            Complete the steps below to finish your orientation.
                        </p>
                    </div>

                    {/* Step indicator */}
                    <div className="mb-6 flex items-start sm:mb-8">
                        {STEPS.map((label, i) => (
                            <div key={label} className="contents">
                                <div className="flex flex-col items-center gap-1.5">
                                    <div
                                        className={cn(
                                            'flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold transition-all duration-300 sm:h-9 sm:w-9',
                                            i === step
                                                ? 'bg-primary text-primary-foreground ring-4 ring-primary/15'
                                                : i < step
                                                  ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300'
                                                  : 'bg-muted text-muted-foreground'
                                        )}
                                    >
                                        {i < step ? <Check className="h-4 w-4" /> : i + 1}
                                    </div>
                                    <span
                                        className={cn(
                                            'hidden text-[11px] font-medium sm:block',
                                            i === step ? 'text-foreground' : 'text-muted-foreground'
                                        )}
                                    >
                                        {label}
                                    </span>
                                </div>
                                {i < STEPS.length - 1 && (
                                    <div
                                        className={cn(
                                            'mx-1 mt-4 h-0.5 flex-1 rounded-full transition-colors duration-300 sm:mt-4.5',
                                            i < step ? 'bg-primary' : 'bg-border'
                                        )}
                                    />
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Card */}
                    <div className="flex-1 overflow-hidden rounded-3xl border bg-card p-5 shadow-sm shadow-black/5 dark:shadow-black/20 sm:p-7">

                        {/* Step 0 — Review completed modules */}
                        {step === 0 && (
                            <div className="animate-in fade-in slide-in-from-right-2 space-y-4 duration-300">
                                <div>
                                    <h2 className="text-sm font-semibold">Modules Completed</h2>
                                    <p className="mt-0.5 text-xs text-muted-foreground">
                                        Here's a summary of everything you've gone through.
                                    </p>
                                </div>
                                <div className="space-y-2">
                                    {progress.map(item => (
                                        <div
                                            key={item.folder_id}
                                            className="flex items-center gap-3 rounded-xl border bg-muted/20 px-3 py-2.5 transition-colors"
                                        >
                                            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900 dark:text-emerald-400">
                                                <CheckCircle2 className="h-4 w-4" />
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <p className="truncate text-sm font-medium">{item.folder_name}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    {item.slide_count} {item.slide_count === 1 ? 'slide' : 'slides'}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Step 1 — Full name + Signature */}
                        {step === 1 && (
                            <div className="animate-in fade-in slide-in-from-right-2 space-y-5 duration-300">
                                <div className="space-y-1.5">
                                    <div>
                                        <h2 className="text-sm font-semibold">Confirm Your Full Name</h2>
                                        <p className="mt-0.5 text-xs text-muted-foreground">
                                            Type your full name exactly as registered:{' '}
                                            <span className="font-medium text-foreground">{user.name}</span>
                                        </p>
                                    </div>
                                    <Label htmlFor="full_name" className="sr-only">Full name</Label>
                                    <div className="relative">
                                        <Input
                                            id="full_name"
                                            value={data.full_name}
                                            onChange={e => setData('full_name', e.target.value)}
                                            placeholder={user.name}
                                            autoFocus
                                            className="pr-9"
                                        />
                                        {nameMatches && (
                                            <Check className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-emerald-600 dark:text-emerald-400" />
                                        )}
                                    </div>
                                    {errors.full_name && (
                                        <p className="text-sm text-destructive">{errors.full_name}</p>
                                    )}
                                </div>

                                <div className="h-px w-full bg-border" />

                                <div className="space-y-1.5">
                                    <div>
                                        <h2 className="text-sm font-semibold">Your Signature</h2>
                                        <p className="mt-0.5 text-xs text-muted-foreground">
                                            Draw your signature below using your mouse or touchscreen.
                                        </p>
                                    </div>
                                    <SignaturePad onChange={val => setData('signature', val ?? '')} />
                                    {errors.signature && (
                                        <p className="text-sm text-destructive">{errors.signature}</p>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Step 2 — Photo & Consent */}
                        {step === 2 && (
                            <div className="animate-in fade-in slide-in-from-right-2 space-y-5 duration-300">
                                <div>
                                    <h2 className="text-sm font-semibold">Take or Upload a Photo</h2>
                                    <p className="mt-0.5 text-xs text-muted-foreground">
                                        This confirms your identity for this acknowledgement.
                                    </p>
                                </div>
                                <PhotoCapture onChange={val => setData('photo', val ?? '')} />
                                {errors.photo && <p className="text-sm text-destructive">{errors.photo}</p>}

                                <label
                                    htmlFor="consented"
                                    className="flex cursor-pointer items-start gap-2.5 rounded-2xl border border-primary/15 bg-primary/5 p-3.5 transition-colors hover:bg-primary/[0.07]"
                                >
                                    <Checkbox
                                        id="consented"
                                        checked={data.consented}
                                        onCheckedChange={checked => setData('consented', checked === true)}
                                        className="mt-0.5"
                                    />
                                    <span className="text-xs font-normal leading-relaxed text-muted-foreground">
                                        I confirm that I have read, understood, and agree to comply with all materials
                                        presented in this orientation. I consent to my electronic signature and photo
                                        being securely stored as part of my official orientation record, in accordance
                                        with the Data Privacy Act.
                                    </span>
                                </label>
                                {errors.consented && (
                                    <p className="text-sm text-destructive">{errors.consented}</p>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Navigation */}
                    <div className="sticky bottom-0 -mx-4 mt-6 border-t bg-background/80 px-4 py-4 backdrop-blur sm:static sm:mx-0 sm:border-0 sm:bg-transparent sm:px-0 sm:py-0 sm:backdrop-blur-none">
                        <div className="flex flex-col-reverse gap-2.5 sm:flex-row sm:items-center sm:justify-between">
                            <Button
                                variant="outline"
                                onClick={back}
                                disabled={step === 0}
                                className="w-full sm:w-auto"
                            >
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back
                            </Button>

                            {step < STEPS.length - 1 ? (
                                <Button
                                    onClick={next}
                                    disabled={
                                        (step === 1 && !canProceedFromStep1)
                                    }
                                    className="w-full sm:w-auto"
                                >
                                    Next
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            ) : (
                                <Button
                                    onClick={handleSubmit}
                                    disabled={!canSubmit || processing}
                                    className="w-full bg-emerald-600 hover:bg-emerald-500 sm:w-auto"
                                >
                                    <CheckCircle2 className="mr-2 h-4 w-4" />
                                    {processing ? 'Submitting...' : 'Submit Acknowledgement'}
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}