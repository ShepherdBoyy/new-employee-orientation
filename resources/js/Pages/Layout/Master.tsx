import { TooltipProvider } from "@/components/ui/tooltip";
import { AppSidebar } from "./AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
type MasterProps = {
    children: React.ReactNode;
};

export default function Master({ children }: MasterProps) {
    return (
        <>
            <TooltipProvider>
                <div>
                    <SidebarProvider>
                        <AppSidebar />
                        <div className="w-full">
                            <header>
                                <div className="h-14 px-4 py-6 flex items-center border-b w-full">
                                    <SidebarTrigger />
                                </div>
                            </header>

                            <main className="flex-1 p-6">{children}</main>
                        </div>
                    </SidebarProvider>
                </div>
            </TooltipProvider>
        </>
    );
}
