import {
    Sidebar,
    SidebarContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Rotate3d } from "lucide-react";
import SidebarNavItem from "./SideBarNav/SidebarNavItem";
import SidebarNavGroup from "./SideBarNav/SidebarNavGroup";
import type { CompanyNav } from "./SideBarNav/navTypes";
import { usePage } from "@inertiajs/react";
import getNavLinks from "./SideBarNav/getNavLinks";

export function AppSidebar({}) {
    const companies = usePage().props.sidebarCompanies as CompanyNav[];
    const navLinks = getNavLinks(companies);

    return (
        <Sidebar variant="floating" collapsible="icon">
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
                {navLinks.map((item) => (
                    <SidebarNavItem key={item.group} item={item} />
                ))}
            </SidebarContent>
        </Sidebar>
    );
}
