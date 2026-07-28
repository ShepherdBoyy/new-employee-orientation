import { Rotate3d } from "lucide-react";
import { motion } from "motion/react";
import OnboardingHeader from "./OnboardingHeader";
import type { OnboardingUser } from "../../Types";

interface WelcomeStepProps {
    onNext: () => void;
    user: OnboardingUser;
}

const container = {
    hidden: {},
    show: {
        transition: {
            staggerChildren: 0.08,
            delayChildren: 0.12,
        },
    },
};

const item = {
    hidden: {
        opacity: 0,
        y: 12,
    },
    show: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.45,
            ease: [0.22, 1, 0.36, 1] as const,
        },
    },
};

export default function WelcomeStep({ onNext, user }: WelcomeStepProps) {
    return (
        <div className="flex flex-col">
            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="flex flex-col"
            >
                {/* Logo */}
                <motion.div variants={item}>
                    <OnboardingHeader />
                </motion.div>

                {/* Content */}
                <div className="space-y-12 px-6 md:px-10 lg:px-14 py-8 md:py-10 lg:py-14">
                    <motion.div variants={item} className="flex flex-col gap-4">
                        <p className="text-sm font-semibold">
                            Hello there! {user.name} 👋
                        </p>

                        <h1 className="text-[40px]/snug font-light tracking-tight">
                            We're glad you're here.
                        </h1>
                    </motion.div>

                    <motion.div variants={item} className="space-y-10">
                        <p className="leading-7 text-muted-foreground">
                            We're excited to have you join the team. This
                            orientation is here to help you get familiar with
                            our company, our values, and the information you'll
                            need as you begin your journey with us.
                        </p>

                        <p className="leading-7 text-muted-foreground">
                            Take your time exploring each module. We'll guide
                            you through everything step by step, so you can feel
                            confident and prepared for your new role.
                        </p>
                    </motion.div>

                    <motion.div variants={item} className="pt-8">
                        <motion.button
                            whileHover={{ scale: 1.08 }}
                            whileTap={{ scale: 0.98 }}
                            transition={{
                                type: "spring",
                                stiffness: 400,
                                damping: 20,
                            }}
                            onClick={onNext}
                            className="rounded-2xl border px-6 py-3"
                        >
                            Let's get started
                        </motion.button>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
}
