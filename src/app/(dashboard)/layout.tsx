import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="overflow-hidden rounded-[var(--radius)] border border-border m-2 shadow-sm h-[calc(100vh-16px)] flex flex-col">
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
