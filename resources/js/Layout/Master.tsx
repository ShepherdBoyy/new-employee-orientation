import { TooltipProvider } from "@/components/ui/tooltip";
import { AppSidebar } from "./AppSidebar";
import {
    SidebarProvider,
    SidebarTrigger,
    SidebarInset,
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

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ChevronsUpDown, LogOut } from "lucide-react";

type MasterProps = {
    children: React.ReactNode;
    id: number;
    name: string;
    email: string;
};
export default function Master({ children, id, name, email }: MasterProps) {
    const url = usePage();
    const user = usePage().props.auth.user as MasterProps;
    return (
        <>
            <TooltipProvider>
                <div>
                    <SidebarProvider>
                        <AppSidebar />
                        <SidebarInset>
                            <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b bg-background px-6">
                                {/* Left */}
                                <div className="flex items-center gap-3">
                                    <SidebarTrigger />

                                    <Separator
                                        orientation="vertical"
                                        className=""
                                    />

                                    {/* Optional breadcrumb/page title */}
                                    <h1 className="text-sm font-medium text-muted-foreground">
                                        Administration
                                    </h1>
                                </div>

                                {/* Right */}
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

                            <main className="flex-1 p-12">{children}</main>
                            <Toaster />
                        </SidebarInset>
                    </SidebarProvider>
                </div>
            </TooltipProvider>
        </>
    );
}
