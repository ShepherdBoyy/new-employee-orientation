import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarFooter,
} from "@/components/ui/sidebar";
import {
    UsersRound,
    BriefcaseBusiness,
    Rotate3d,
    ChevronsUpDown,
    LogOut,
    Building2,
    GitBranchPlus,
    ShieldCheck,
} from "lucide-react";
import SidebarNavItem from "./SideBarNav/SidebarNavItem";
import SidebarNavGroup from "./SideBarNav/SidebarNavGroup";
import type { CompanyNav, NavItem } from "./SideBarNav/navTypes";
import { usePage, Link, router } from "@inertiajs/react";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type AdminUser = {
    id: number;
    name: string;
    email: string;
};

export function AppSidebar() {
    const companies = usePage().props.sidebarCompanies as CompanyNav[];
    const user = usePage().props.auth.user as AdminUser;
    const navLinks: NavItem[] = [
        {
            type: "link",
            group: "Organization",
            links: [
                {
                    icon: <Building2 />,
                    title: "Companies",
                    path: "/admin/companies",
                },
                {
                    icon: <BriefcaseBusiness />,
                    title: "Jobs",
                    path: "/admin/job-positions",
                },
                {
                    icon: <GitBranchPlus />,
                    title: "Job Assignments",
                    path: "/admin/all-job-positions",
                },
            ],
        },

        {
            type: "link",
            group: "Users",
            links: [
                {
                    icon: <ShieldCheck />,
                    title: "Admin",
                    path: "/admin/users/admins",
                },
                {
                    icon: <UsersRound />,
                    title: "Employee",
                    path: "/admin/users/employees",
                },
            ],
        },
        {
            type: "link",
            group: "Presentation",
            links: [
                ...companies.map((company) => ({
                    logo_path: company.logo_path,
                    title: company.name,
                    path: `/admin/folders/${company.slug}`,
                })),
            ],
        },
    ];

    return (
        <Sidebar variant="inset" collapsible="icon">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild size="lg">
                            <a href="#">
                                <div className="flex size-10 items-center justify-center overflow-hidden rounded-xl transition-all duration-500">
                                    <Rotate3d absoluteStrokeWidth />
                                </div>
                                <div className="grid flex-1 leading-tight transition-all duration-500 group-data-[collapsible=icon]:hidden">
                                    <span className="truncate font-sans text-sm font-medium">
                                        NEO
                                    </span>
                                    <span className="truncate text-xs text-muted-foreground">
                                        New Employee Orientation
                                    </span>
                                </div>
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                {navLinks.map((item) => {
                    switch (item.type) {
                        case "link":
                            return (
                                <SidebarNavItem key={item.links} item={item} />
                            );

                        case "group":
                            return (
                                <SidebarNavGroup key={item.title} item={item} />
                            );

                        default:
                            return null;
                    }
                })}
            </SidebarContent>
            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <SidebarMenuButton
                                    size="lg"
                                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                                >
                                    <Avatar className="h-8 w-8 rounded-lg  group-data-[collapsible=icon]:ml-10">
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
                                side="right"
                                sideOffset={4}
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
                                    onClick={() => router.get("/logout")}
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
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    );
}
