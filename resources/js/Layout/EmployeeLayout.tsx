import { useState } from "react";
import { Rotate3d, MessageCircle, X } from "lucide-react";
import FloatingFAQ from "./FloatingFAQ";
type EmployeeLayoutProps = {
    children: React.ReactNode;
};

export default function EmployeeLayout({ children }: EmployeeLayoutProps) {
    const [openFAQ, setOpenFAQ] = useState(false);

    return (
        <>
            <nav className="h-16 border-b shrink-0 font-poppins flex justify-between items-center px-10">
                <div className="flex items-center gap-1">
                    <Rotate3d absoluteStrokeWidth strokeWidth={1.5} size={22} />
                    <p>NEO</p>
                </div>

                <div>Logout</div>
            </nav>

            <main className="mx-auto w-full max-w-7xl flex-col p-8 font-poppins">
                {children}
            </main>

            {/* FAQ Window */}
            {openFAQ && (
                <div className="fixed bottom-24 right-8 z-50 w-[380px] rounded-2xl border bg-background shadow-2xl">
                    <div className="flex items-center justify-between border-b px-5 py-4">
                        <div>
                            <h3 className="font-semibold">
                                Frequently Asked Questions
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                Need help? Start here.
                            </p>
                        </div>

                        <button onClick={() => setOpenFAQ(false)}>
                            <X size={18} />
                        </button>
                    </div>

                    <div className="max-h-125 overflow-y-auto p-5">
                        {/* <FAQ /> */}
                        FAQ Component goes here...
                    </div>
                </div>
            )}

            <FloatingFAQ />
            {/* FAB */}
            <button
                onClick={() => setOpenFAQ((prev) => !prev)}
                className="fixed bottom-8 right-8 z-50 flex items-center gap-3 rounded-full bg-primary px-5 py-3 text-primary-foreground shadow-xl transition-all hover:scale-105 hover:shadow-2xl"
            >
                <MessageCircle size={20} />
                <span className="font-medium">Need Help?</span>
            </button>
        </>
    );
}
