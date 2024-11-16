import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader } from "./components/ui/sidebar";
import { UnplannedTasks } from "./example/UnplannedTasks";

export function AppSidebar() {
   return (
      <Sidebar>
         <SidebarHeader />
         <SidebarContent>
            <UnplannedTasks />
         </SidebarContent>
         <SidebarFooter />
      </Sidebar>
   );
}
