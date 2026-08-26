import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Rotate3d } from "lucide-react";
import { motion } from "motion/react";
import { Form } from "@inertiajs/react";
const pageVariants = {
    hidden: {
        opacity: 0,
    },
    visible: {
        opacity: 1,
        transition: {
            duration: 0.35,
        },
    },
};

const leftPanelVariants = {
    hidden: {
        opacity: 0,
        x: -24,
    },
    visible: {
        opacity: 1,
        x: 0,
        transition: {
            duration: 0.55,
            ease: "easeOut",
        },
    },
};

const rightPanelVariants = {
    hidden: {
        opacity: 0,
        x: 24,
    },
    visible: {
        opacity: 1,
        x: 0,
        transition: {
            duration: 0.5,
            ease: "easeOut",
            delay: 0.1,
        },
    },
};

const contentVariants = {
    hidden: {},
    visible: {
        transition: {
            delayChildren: 0.2,
            staggerChildren: 0.08,
        },
    },
};

const itemVariants = {
    hidden: {
        opacity: 0,
        y: 12,
    },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.35,
            ease: "easeOut",
        },
    },
};

const logoVariants = {
    hidden: {
        opacity: 0,
        scale: 0.9,
    },
    visible: {
        opacity: 1,
        scale: 1,
        transition: {
            duration: 0.4,
            ease: "easeOut",
        },
    },
};
export default function Login() {
    return (
        <motion.div
            className="min-h-screen bg-background overflow-hidden"
            variants={pageVariants}
            initial="hidden"
            animate="visible"
        >
            <div className="grid min-h-screen lg:grid-cols-2">
                {/* LEFT SIDE */}
                <motion.div
                    variants={leftPanelVariants}
                    className="relative hidden overflow-hidden bg-linear-to-br from-slate-950 via-slate-900 to-slate-800 text-white lg:flex rounded-lg -ml-2"
                >
                    {/* Background decoration */}
                    <div className="absolute inset-0 overflow-hidden">
                        <div className="absolute -top-32 -right-32 size-96 rounded-full bg-white/5 blur-3xl" />

                        <div className="absolute -bottom-32 -left-32 size-96 rounded-full bg-sky-400/10 blur-3xl" />

                        <div className="absolute top-1/2 left-1/2 size-125 -translate-x-1/2 -translate-y-1/2 rounded-full bg-sky-300/5 blur-[120px]" />
                    </div>

                    {/* Brand */}
                    <div className="relative flex w-full flex-col">
                        <motion.div
                            variants={logoVariants}
                            className="flex items-center gap-3 p-10"
                        >
                            <div className="flex size-11 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/10 backdrop-blur">
                                <Rotate3d
                                    size={24}
                                    absoluteStrokeWidth
                                    strokeWidth={1.3}
                                />
                            </div>

                            <div>
                                <span className="block font-medium tracking-wide">
                                    NEO
                                </span>

                                <span className="text-xs text-white/40">
                                    New Employee Orientation
                                </span>
                            </div>
                        </motion.div>

                        {/* Hero */}
                        <motion.div
                            variants={contentVariants}
                            className="relative mt-auto max-w-2xl p-10 pb-16 xl:p-16 xl:pb-20"
                        >
                            <motion.p
                                variants={itemVariants}
                                className="text-xs font-medium uppercase tracking-[0.3em] text-white/40"
                            >
                                New Employee Orientation
                            </motion.p>

                            <motion.h1
                                variants={itemVariants}
                                className="mt-6 max-w-xl text-5xl font-medium leading-[1.15] tracking-tight xl:text-6xl"
                            >
                                Everything you need to get started.
                            </motion.h1>

                            <motion.p
                                variants={itemVariants}
                                className="mt-6 max-w-lg text-base leading-relaxed text-white/60"
                            >
                                Access onboarding materials, orientation
                                modules, and company resources — all in one
                                place.
                            </motion.p>
                        </motion.div>
                    </div>
                </motion.div>

                {/* RIGHT SIDE */}
                <motion.div
                    variants={rightPanelVariants}
                    className="flex min-h-screen items-center justify-center bg-slate-50/60 px-6 py-12 sm:px-10 lg:bg-background lg:px-16"
                >
                    <Form
                        action="/login"
                        method="post"
                        className="w-full max-w-md"
                    >
                        {({ errors, processing }) => (
                            <motion.div
                                variants={contentVariants}
                                initial="hidden"
                                animate="visible"
                            >
                                {/* Mobile brand */}
                                <div className="mb-12 flex flex-col items-center lg:hidden">
                                    <div className="flex size-11 items-center justify-center rounded-xl bg-slate-900 text-white">
                                        <Rotate3d
                                            size={23}
                                            absoluteStrokeWidth
                                            strokeWidth={1.3}
                                        />
                                    </div>

                                    <span className="mt-3 font-semibold tracking-wide">
                                        NEO
                                    </span>
                                </div>

                                {/* Header */}
                                <motion.div variants={itemVariants}>
                                    <h1 className="text-center text-3xl font-medium tracking-tight lg:text-left">
                                        Welcome back
                                    </h1>

                                    <p className="mt-2 text-center text-sm text-muted-foreground lg:text-left">
                                        Sign in with your company account to
                                        continue.
                                    </p>
                                </motion.div>

                                {/* Form */}
                                <motion.div
                                    variants={itemVariants}
                                    className="mt-10 space-y-6"
                                >
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email</Label>

                                        <Input
                                            className="h-11"
                                            id="email"
                                            name="email"
                                            type="email"
                                            placeholder="Enter your work email"
                                            required
                                        />

                                        {errors.email && (
                                            <p className="text-sm text-destructive">
                                                {errors.email}
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="password">
                                            Password
                                        </Label>

                                        <Input
                                            className="h-11"
                                            id="password"
                                            name="password"
                                            type="password"
                                            placeholder="Enter your password"
                                            required
                                        />

                                        {errors.password && (
                                            <p className="text-sm text-destructive">
                                                {errors.password}
                                            </p>
                                        )}
                                    </div>
                                </motion.div>

                                {/* Submit */}
                                <motion.div
                                    variants={itemVariants}
                                    className="mt-8"
                                >
                                    <Button
                                        type="submit"
                                        className="h-11 w-full rounded-xl font-semibold"
                                        disabled={processing}
                                    >
                                        {processing && (
                                            <Spinner data-icon="inline-start" />
                                        )}

                                        {processing
                                            ? "Signing in..."
                                            : "Sign in"}
                                    </Button>
                                </motion.div>

                                {/* Footer */}
                                <motion.p
                                    variants={itemVariants}
                                    className="mt-8 text-center text-xs text-muted-foreground"
                                >
                                    Access is provided through your email.
                                </motion.p>
                            </motion.div>
                        )}
                    </Form>
                </motion.div>
            </div>
        </motion.div>
    );
}
