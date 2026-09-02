import { TooltipProvider } from "@/components/ui/tooltip";
import { AppSidebar } from "./AppSidebar";
import {
    SidebarProvider,
    SidebarTrigger,
    SidebarMenuButton,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Link, router, usePage } from "@inertiajs/react";
import { Toaster } from "@/components/ui/sonner";
import NotificationBell from "./NotificationBell";
import {
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuItem,
    DropdownMenu,
} from "@/components/ui/dropdown-menu";
import PresentationPanel from "./PresentationPanel";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ChevronsUpDown, LogOut, ChevronRight } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import type { PageProps } from "./PresentationPanel";
import getNavLinks from "./SideBarNav/getNavLinks";
import type { CompanyNav } from "./SideBarNav/navTypes";

type MasterProps = {
    children: React.ReactNode;
    id: number;
    name: string;
    email: string;
};
const sidebarVariants = {
    hidden: {
        x: -16,
        opacity: 0,
    },
    visible: {
        x: 0,
        opacity: 1,
        transition: {
            duration: 0.25,
            ease: "easeOut",
        },
    },
};

const panelVariants = {
    hidden: {
        x: -12,
        opacity: 0,
    },
    visible: {
        x: 0,
        opacity: 1,
        transition: {
            duration: 0.22,
            ease: "easeOut",
            delay: 0.08,
        },
    },
};

const shellVariants = {
    hidden: {
        y: 8,
        opacity: 0,
    },
    visible: {
        y: 0,
        opacity: 1,
        transition: {
            duration: 0.28,
            ease: "easeOut",
            delay: 0.12,
        },
    },
};
export default function Master({ children }: MasterProps) {
    const user = usePage().props.auth.user as MasterProps;
    const { props, url } = usePage<PageProps>();
    const company = props.company;
    const showPresentationPanel = company?.slug ?? "none";
    const companies = usePage().props.sidebarCompanies as CompanyNav[];

    const navLinks = getNavLinks(companies);
    const currentPath = new URL(url, window.location.origin).pathname;
    const currentNav = navLinks
        .flatMap((group) =>
            group.links.map((link) => ({
                group: group.group,
                title: link.title,
                path: link.path,
            })),
        )
        .find(
            (link) =>
                currentPath === link.path ||
                currentPath.startsWith(`${link.path}/`),
        );

    return (
        <>
            <TooltipProvider>
                <div className="">
                    <SidebarProvider className="h-svh overflow-hidden bg-linear-to-r from-slate-900 via-slate-800 to-slate-900">
                        <motion.div
                            variants={sidebarVariants}
                            initial="hidden"
                            animate="visible"
                            className="shrink-0"
                        >
                            <AppSidebar />
                        </motion.div>
                        <div className="flex flex-1 min-h-0 gap-3 p-2">
                            <AnimatePresence mode="wait">
                                {company && (
                                    <motion.div
                                        key={showPresentationPanel}
                                        variants={panelVariants}
                                        initial="hidden"
                                        animate="visible"
                                        exit="hidden"
                                        className="shrink-0"
                                    >
                                        <PresentationPanel />
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <motion.div
                                variants={shellVariants}
                                initial="hidden"
                                animate="visible"
                                className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border bg-background shadow-xl"
                            >
                                <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b bg-background px-6">
                                    <div className="flex items-center gap-3">
                                        <SidebarTrigger />

                                        <Separator orientation="vertical" />

                                        <div className="flex items-center gap-2 text-sm">
                                            <span className="text-muted-foreground">
                                                {currentNav?.group ??
                                                    "Administration"}
                                            </span>

                                            {currentNav && (
                                                <>
                                                    <ChevronRight className="size-3.5 text-muted-foreground/40" />

                                                    <span className="font-medium text-foreground">
                                                        {currentNav.title}
                                                    </span>
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <NotificationBell />

                                        <DropdownMenu>
                                            <DropdownMenuTrigger
                                                className="w-60"
                                                asChild
                                            >
                                                <SidebarMenuButton className="">
                                                    <Avatar>
                                                        <AvatarImage />
                                                        <AvatarFallback className="rounded-lg">
                                                            {user.name
                                                                .slice(0, 2)
                                                                .toUpperCase()}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div className="grid flex-1 text-left text-sm leading-tight">
                                                        <span className="truncate font-medium">
                                                            {user.name}
                                                        </span>
                                                        <span className="truncate text-xs">
                                                            {user.email}
                                                        </span>
                                                    </div>
                                                    <ChevronsUpDown className="ml-auto size-4" />
                                                </SidebarMenuButton>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent
                                                className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                                                align="end"
                                                side="bottom"
                                                sideOffset={6}
                                            >
                                                <DropdownMenuLabel className="p-0 font-normal">
                                                    <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                                                        <Avatar className="h-8 w-8 rounded-lg">
                                                            <AvatarImage />
                                                            <AvatarFallback className="rounded-lg">
                                                                {user.name
                                                                    .slice(0, 2)
                                                                    .toUpperCase()}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <div className="grid flex-1 text-left text-sm leading-tight">
                                                            <span className="truncate font-medium">
                                                                {user.name}
                                                            </span>
                                                            <span className="truncate text-xs">
                                                                {user.email}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </DropdownMenuLabel>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem
                                                    onClick={() =>
                                                        router.get("/logout")
                                                    }
                                                >
                                                    <Link
                                                        href="/logout"
                                                        className="flex gap-2 items-center justify-between"
                                                    >
                                                        <LogOut />
                                                        <span>Log out</span>
                                                    </Link>
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </header>

                                <main className="flex-1 overflow-y-auto px-6 py-6">
                                    <AnimatePresence mode="wait">
                                        <motion.div
                                            key={currentPath}
                                            initial={{ opacity: 0, y: 8 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -4 }}
                                            transition={{
                                                duration: 0.18,
                                                ease: "easeOut",
                                            }}
                                            className="h-full"
                                        >
                                            {children}
                                        </motion.div>
                                    </AnimatePresence>
                                </main>

                                <Toaster />
                            </motion.div>
                        </div>
                    </SidebarProvider>
                </div>
            </TooltipProvider>
        </>
    );
}
