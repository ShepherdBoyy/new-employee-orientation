import { useState } from "react";
import { MessageCircle, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
} from "@/components/ui/drawer";

export default function FloatingFAQ() {
    const [open, setOpen] = useState(false);

    return (
        <>
            {/* Desktop */}
            <div className="hidden md:block ">
                {open && (
                    <div className="fixed bottom-10 right-8 z-50 w-[380px] rounded-2xl border bg-background shadow-2xl">
                        <div className="flex items-center justify-between border-b px-5 py-4">
                            <div>
                                <h3 className="font-semibold">Need Help?</h3>
                                <p className="text-sm text-muted-foreground">
                                    Frequently Asked Questions
                                </p>
                            </div>

                            <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => setOpen(false)}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>

                        <div className="max-h-[500px] overflow-y-auto p-5">
                            test
                        </div>
                    </div>
                )}

                <Button
                    onClick={() => setOpen((o) => !o)}
                    size="lg"
                    className="fixed bottom-8 right-8 z-50 rounded-full shadow-xl"
                >
                    <MessageCircle className="mr-2 h-5 w-5" />
                    Need Help?
                </Button>
            </div>

            {/* Mobile */}
            <div className="md:hidden">
                <Drawer open={open} onOpenChange={setOpen}>
                    <Button
                        onClick={() => setOpen(true)}
                        size="icon"
                        className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full shadow-xl"
                    >
                        <MessageCircle className="h-6 w-6" />
                    </Button>

                    <DrawerContent>
                        <DrawerHeader>
                            <DrawerTitle>
                                Frequently Asked Questions
                            </DrawerTitle>
                        </DrawerHeader>

                        <div className="max-h-[70vh] overflow-y-auto px-4 pb-6">
                            test
                        </div>
                    </DrawerContent>
                </Drawer>
            </div>
        </>
    );
}
