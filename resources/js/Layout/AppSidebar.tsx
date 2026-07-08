import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
    LayoutDashboard,
    UsersRound,
    SwatchBook,
    BriefcaseBusiness,
    Projector,
    CalendarRange,
    ToolCase,
} from "lucide-react";
import SidebarNavItem from "./SideBarNav/SidebarNavItem";
import SidebarNavGroup from "./SideBarNav/SidebarNavGroup";
import type { NavItem } from "./SideBarNav/navTypes";

export function AppSidebar() {
    const navLinks: NavItem[] = [
        {
            type: "link",
            title: "Dashboard",
            path: "/admin/dashboard",
            icon: <LayoutDashboard absoluteStrokeWidth />,
        },

        {
            type: "link",
            title: "Requests",
            path: "/admin/extension-requests",
            icon: <CalendarRange absoluteStrokeWidth />,
        },
        {
            type: "group",
            title: "Organization",
            icon: <BriefcaseBusiness absoluteStrokeWidth />,
            items: [
                {
                    title: "Companies",
                    path: "/admin/companies",
                },
                {
                    title: "Jobs",
                    path: "/admin/all-job-positions",
                },
                {
                    title: "Job Assignments",
                    path: "/admin/job-positions",
                },
            ],
        },
        {
            type: "group",
            title: "Presentation",
            icon: <Projector absoluteStrokeWidth />,
            items: [
                {
                    title: "Folder",
                    path: "/admin/folders",
                },
                {
                    title: "Assignment",
                    path: "/admin/folder-targets",
                },
            ],
        },
        {
            type: "group",
            title: "Users",
            items: [
                {
                    title: "Admin",
                    path: "/admin/users/admins",
                },
                {
                    title: "Employee",
                    path: "/admin/users/employees",
                },
            ],
            icon: <UsersRound />,
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
                                    <SwatchBook />
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
                <SidebarGroup>
                    <SidebarGroupLabel>Platform</SidebarGroupLabel>
                    <SidebarMenu>
                        {navLinks.map((item) => {
                            switch (item.type) {
                                case "link":
                                    return (
                                        <SidebarNavItem
                                            key={item.title}
                                            item={item}
                                        />
                                    );

                                case "group":
                                    return (
                                        <SidebarNavGroup
                                            key={item.title}
                                            item={item}
                                        />
                                    );

                                default:
                                    return null;
                            }
                        })}
                    </SidebarMenu>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    );
}
