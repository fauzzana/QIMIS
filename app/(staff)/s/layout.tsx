import { TooltipProvider } from "@/components/ui/tooltip";
import { AppSidebar } from "@/components/layout/app-sidebar-staff";
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";


export default function StaffLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
      <TooltipProvider>
        <AppSidebar />
        <SidebarInset>
          {children}
        </SidebarInset>
      </TooltipProvider>
    </SidebarProvider>
  );
}
