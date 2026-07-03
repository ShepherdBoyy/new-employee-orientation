import { TooltipProvider } from "@/components/ui/tooltip";
import { AppSidebar } from "./AppSidebar";
import {
    SidebarProvider,
    SidebarTrigger,
    SidebarInset,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { usePage } from "@inertiajs/react";

type MasterProps = {
    children: React.ReactNode;
};

export default function Master({ children }: MasterProps) {
    const url = usePage();
    return (
        <>
            <TooltipProvider>
                <div>
                    <SidebarProvider>
                        <AppSidebar />
                        <SidebarInset className="">
                            <header className="flex h-14 px-4 border-b shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
                                <div className="flex items-center gap-2 mt-2">
                                    <SidebarTrigger />
                                    <Separator orientation="vertical" />
                                </div>
                            </header>

                            <main className="flex-1 p-6">{children}</main>
                        </SidebarInset>
                    </SidebarProvider>
                </div>
            </TooltipProvider>
        </>
    );
}
