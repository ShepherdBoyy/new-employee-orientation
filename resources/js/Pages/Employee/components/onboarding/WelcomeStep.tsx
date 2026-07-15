import { Rotate3d } from "lucide-react";
import type { OnboardingUser } from "../../Types";
interface WelcomeStepProps {
    onNext: () => void;
    user: OnboardingUser;
}

export default function WelcomeStep({ onNext, user }: WelcomeStepProps) {
    return (
        <div className="flex flex-col">
            <div className="flex gap-2 items-center px-6 py-6 ">
                <Rotate3d absoluteStrokeWidth strokeWidth={1.5} size={22} />
                <p className="">NEO</p>
            </div>

            <div className="space-y-12 px-12 py-14">
                <div className="flex flex-col gap-4">
                    <p className="text-sm font-semibold">
                        Hello there! {user.name} 👋
                    </p>
                    <h1 className="text-[40px]/snug font-light tracking-tight">
                        We're glad you're here.
                    </h1>
                </div>

                <div className="space-y-10">
                    <p className="text-muted-foreground leading-7">
                        We're excited to have you join the team. This
                        orientation is here to help you get familiar with our
                        company, our values, and the information you'll need as
                        you begin your journey with us.
                    </p>
                    <p className="text-muted-foreground leading-7">
                        Take your time exploring each module. We'll guide you
                        through everything step by step, so you can feel
                        confident and prepared for your new role.
                    </p>
                </div>
                <div className="pt-8">
                    <button
                        onClick={onNext}
                        className="border px-6 py-3 rounded-2xl"
                    >
                        Let's get started
                    </button>
                </div>
            </div>
        </div>
    );
}
