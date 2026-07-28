// shared/OnboardingHeader.tsx

import { Rotate3d } from "lucide-react";

export default function OnboardingHeader() {
    return (
        <header className="flex items-center gap-2 px-6 py-5">
            <Rotate3d absoluteStrokeWidth strokeWidth={1.5} size={22} />

            <span className="font-medium tracking-tight text-sm">NEO</span>
        </header>
    );
}
