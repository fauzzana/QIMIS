import { TooltipProvider } from "@/components/ui/tooltip";
import { AppSidebar } from "@/components/layout/app-sidebar-admin"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";


export default function AdminLayout({
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
