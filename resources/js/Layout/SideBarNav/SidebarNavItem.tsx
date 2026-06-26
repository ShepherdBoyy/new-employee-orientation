import { Link, usePage } from "@inertiajs/react";
import { useSidebar } from "@/components/ui/sidebar";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import type { NavLinkItem } from "./navTypes";

type SidebarNavItemProps = {
    item: NavLinkItem;
};

export default function SidebarNavItem({ item }: SidebarNavItemProps) {
    const { state } = useSidebar();
    const collapsed = state === "collapsed";
    const { url } = usePage();
    const isActive = url.startsWith(item.path);
    return (
        <>
            <SidebarMenuItem>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Link href={item.path}>
                            <SidebarMenuButton
                                className={
                                    isActive ? "bg-blue-500 text-white" : ""
                                }
                            >
                                {item.icon}

                                {!collapsed && <span>{item.title}</span>}
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
        </>
    );
}
