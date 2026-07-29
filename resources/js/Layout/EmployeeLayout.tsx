import { useState } from "react";
import { Rotate3d, MessageCircle, X } from "lucide-react";
import FloatingFAQ from "./FloatingFAQ";
import { OnboardingUser } from "@/Pages/Employee/Types";
import { usePage } from "@inertiajs/react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { LogOut, ChevronDown } from "lucide-react";
import { router } from "@inertiajs/react";
type EmployeeLayoutProps = {
    children: React.ReactNode;
    user: OnboardingUser;
};

export default function EmployeeLayout({ children }: EmployeeLayoutProps) {
    const user = usePage().props.auth.user;
    return (
        <>
            <nav className="h-16 border-b shrink-0  flex justify-between items-center px-10">
                <div className="flex items-center gap-1">
                    <Rotate3d absoluteStrokeWidth strokeWidth={1.5} size={22} />
                    <p>NEO</p>
                </div>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button className="group flex items-center gap-3 rounded-xl px-2 py-2 transition-colors hover:bg-accent focus:outline-none">
                            <Avatar className="h-10 w-10 border">
                                <AvatarFallback className="bg-primary/10 font-medium ">
                                    {user.name
                                        .split(" ")
                                        .map((part: string) => part[0])
                                        .join("")
                                        .slice(0, 2)
                                        .toUpperCase()}
                                </AvatarFallback>
                            </Avatar>

                            <div className="hidden text-left md:block">
                                <p className="text-sm font-medium leading-none">
                                    {user.name}
                                </p>
                                <p className="mt-1 text-xs text-muted-foreground">
                                    {user.email}
                                </p>
                            </div>

                            <ChevronDown className="hidden h-4 w-4 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-180 md:block" />
                        </button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent
                        align="end"
                        className="w-72 rounded-xl p-2"
                    >
                        <DropdownMenuLabel className="p-0">
                            <div className="flex items-center gap-3 rounded-lg px-2 py-2">
                                <Avatar className="h-10 w-10">
                                    <AvatarFallback className="bg-primary/10 text-base font-semibold text-primary">
                                        {user.name
                                            .split(" ")
                                            .map((part: string) => part[0])
                                            .join("")
                                            .slice(0, 2)
                                            .toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>

                                <div className="min-w-0">
                                    <p className="truncate font-semibold">
                                        {user.name}
                                    </p>
                                    <p className="truncate text-xs font-normal text-muted-foreground">
                                        {user.email}
                                    </p>
                                </div>
                            </div>
                        </DropdownMenuLabel>

                        <DropdownMenuSeparator />

                        <DropdownMenuItem
                            className=""
                            onClick={() => router.get("/logout")}
                        >
                            <LogOut className="mr-2 h-4 w-4" />
                            Sign Out
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </nav>

            <main className="mx-auto w-full max-w-7xl flex-col p-4 lg:p-8">
                {children}
            </main>

            {/* {openFAQ && (
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
                        FAQ Component goes here...
                    </div>
                </div>
            )}

            <FloatingFAQ />
            <button
                onClick={() => setOpenFAQ((prev) => !prev)}
                className="fixed bottom-8 right-8 z-50 flex items-center gap-3 rounded-full bg-primary px-5 py-3 text-primary-foreground shadow-xl transition-all hover:scale-105 hover:shadow-2xl"
            >
                <MessageCircle size={20} />
                <span className="font-medium">Need Help?</span>
            </button> */}
        </>
    );
}
