import {
    Sidebar,
    SidebarContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
    UsersRound,
    BriefcaseBusiness,
    Rotate3d,
    Building2,
    GitBranchPlus,
    ShieldCheck,
} from "lucide-react";
import SidebarNavItem from "./SideBarNav/SidebarNavItem";
import SidebarNavGroup from "./SideBarNav/SidebarNavGroup";
import type { CompanyNav, NavItem } from "./SideBarNav/navTypes";
import { usePage } from "@inertiajs/react";

export function AppSidebar({}) {
    const companies = usePage().props.sidebarCompanies as CompanyNav[];

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
            group: "Workspace",
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
        <Sidebar variant="inset" collapsible="icon" className="">
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
        </Sidebar>
    );
}
