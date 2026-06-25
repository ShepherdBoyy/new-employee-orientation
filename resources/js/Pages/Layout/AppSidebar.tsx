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
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronRight } from "lucide-react";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { LayoutDashboard, Cuboid, SwatchBook } from "lucide-react";
import { useSidebar } from "@/components/ui/sidebar";
import { Link } from "@inertiajs/react";

export function AppSidebar() {
    const { state } = useSidebar();
    const collapsed = state === "collapsed";

    const navLinks = [
        {
            title: "Dashboard",
            path: "/admin/dashboard",
            icon: <LayoutDashboard absoluteStrokeWidth />,
        },
        {
            title: "Companies",
            path: "/admin/companies",
            icon: <Cuboid />,
        },
        {
            title: "Users",
            items: [
                {
                    title: "Admins",
                    path: "/admin/users/admins",
                },
                {
                    title: "Employees",
                    path: "/admin/users/employees",
                },
            ],
            icon: <Cuboid />,
        },
    ];

    return (
        <Sidebar collapsible="icon">
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
                        {navLinks.map((item, index) =>
                            item.items ? (
                                <Collapsible
                                    key={index}
                                    className="w-full group/collapsible"
                                >
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <CollapsibleTrigger asChild>
                                                <SidebarMenuButton>
                                                    {item.icon}

                                                    {!collapsed && (
                                                        <>
                                                            <span className="ml-2 font-sans">
                                                                {item.title}
                                                            </span>

                                                            <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                                        </>
                                                    )}
                                                </SidebarMenuButton>
                                            </CollapsibleTrigger>
                                        </TooltipTrigger>

                                        {collapsed && (
                                            <TooltipContent side="right">
                                                {item.title}
                                            </TooltipContent>
                                        )}
                                    </Tooltip>

                                    <CollapsibleContent className="ml-8">
                                        {item.items.map((child, i) => (
                                            <SidebarMenuItem key={i}>
                                                <Link href={child.path}>
                                                    <SidebarMenuButton>
                                                        {!collapsed && (
                                                            <span className="ml-2 text-sm font-sans">
                                                                {child.title}
                                                            </span>
                                                        )}
                                                    </SidebarMenuButton>
                                                </Link>
                                            </SidebarMenuItem>
                                        ))}
                                    </CollapsibleContent>
                                </Collapsible>
                            ) : (
                                <SidebarMenuItem key={index}>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Link href={item.path}>
                                                <SidebarMenuButton>
                                                    {item.icon}
                                                    {!collapsed && (
                                                        <span className="ml-2 font-sans">
                                                            {item.title}
                                                        </span>
                                                    )}
                                                </SidebarMenuButton>
                                            </Link>
                                        </TooltipTrigger>
                                        {collapsed && (
                                            <TooltipContent side="right">
                                                {item.title}
                                            </TooltipContent>
                                        )}
                                    </Tooltip>
                                </SidebarMenuItem>
                            ),
                        )}
                    </SidebarMenu>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    );
}
