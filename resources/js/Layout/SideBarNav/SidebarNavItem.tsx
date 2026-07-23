import { Link, usePage } from "@inertiajs/react";
import { SidebarGroup, SidebarMenu, useSidebar } from "@/components/ui/sidebar";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarGroupLabel,
} from "@/components/ui/sidebar";
import type { NavLinkItem } from "./navTypes";

type SidebarNavItemProps = {
    item: NavLinkItem;
};

export default function SidebarNavItem({ item }: SidebarNavItemProps) {
    const { state } = useSidebar();
    const collapsed = state === "collapsed";
    const { url } = usePage();
    return (
        <SidebarGroup>
            <SidebarGroupLabel>{item.group}</SidebarGroupLabel>

            <SidebarMenu>
                {item.links.map((link) => {
                    const isActive = url.startsWith(link.path);

                    return (
                        <SidebarMenuItem key={link.path}>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Link href={link.path}>
                                        <SidebarMenuButton
                                            className={
                                                isActive
                                                    ? "bg-linear-to-r from-slate-900 via-slate-800 to-slate-900 text-white"
                                                    : ""
                                            }
                                        >
                                            <div className="flex h-5 w-5 items-center justify-center">
                                                {link.logo_path ? (
                                                    <Avatar className="h-6 w-6 rounded-md">
                                                        <AvatarImage
                                                            src={`/storage/${link.logo_path}`}
                                                            alt={link.title}
                                                            className=""
                                                        />

                                                        <AvatarFallback className="rounded-md text-[10px]">
                                                            {link.title
                                                                .slice(0, 2)
                                                                .toUpperCase()}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                ) : (
                                                    link.icon
                                                )}
                                            </div>

                                            {!collapsed && (
                                                <span>{link.title}</span>
                                            )}
                                        </SidebarMenuButton>
                                    </Link>
                                </TooltipTrigger>

                                {collapsed && (
                                    <TooltipContent side="right">
                                        {link.title}
                                    </TooltipContent>
                                )}
                            </Tooltip>
                        </SidebarMenuItem>
                    );
                })}
            </SidebarMenu>
        </SidebarGroup>
    );
}
