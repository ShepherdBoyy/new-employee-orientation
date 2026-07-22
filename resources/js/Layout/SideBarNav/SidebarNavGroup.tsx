import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import {
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { ChevronRight } from "lucide-react";
import { Link, usePage } from "@inertiajs/react";
import { useSidebar } from "@/components/ui/sidebar";
import { useEffect, useState } from "react";
import type { NavGroupItem } from "./navTypes";

type SidebarGroupNavProps = {
    item: NavGroupItem;
};

export default function SidebarNavGroup({ item }: SidebarGroupNavProps) {
    const { url } = usePage();
    const { state } = useSidebar();
    const collapsed = state === "collapsed";
    const hasActiveChild = item.items.some((child) =>
        url.startsWith(child.path),
    );

    const [open, setOpen] = useState(hasActiveChild);

    useEffect(() => {
        if (hasActiveChild) {
            setOpen(true);
        }
    }, [hasActiveChild]);
    return (
        <>
            <Collapsible
                open={open}
                onOpenChange={setOpen}
                className="group/collapsible"
            >
                <Tooltip>
                    <TooltipTrigger asChild>
                        <CollapsibleTrigger asChild>
                            <SidebarMenuButton
                                tooltip={item.title}
                                className={
                                    hasActiveChild
                                        ? "bg-blue-500 text-white"
                                        : ""
                                }
                            >
                                <SidebarMenuSubItem>
                                    {item.icon}
                                </SidebarMenuSubItem>

                                {!collapsed && (
                                    <>
                                        <span>{item.title}</span>
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
                <CollapsibleContent className="">
                    <SidebarMenuSub>
                        {item.items.map((child, i) => {
                            const isActive = url.startsWith(child.path);
                            return (
                                <SidebarMenuSubItem
                                    key={i}
                                    className="group-data-[collapsible=icon]:hidden"
                                >
                                    <Link href={child.path}>
                                        <SidebarMenuButton
                                            className={
                                                isActive ? "font-bold" : ""
                                            }
                                        >
                                            {!collapsed && (
                                                <span className="text-sm font-sans">
                                                    {child.title}
                                                </span>
                                            )}
                                        </SidebarMenuButton>
                                    </Link>
                                </SidebarMenuSubItem>
                            );
                        })}
                    </SidebarMenuSub>
                </CollapsibleContent>
            </Collapsible>
        </>
    );
}
