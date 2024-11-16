import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarHeader } from "./components/ui/sidebar";
import { UnplannedTasks } from "./example/UnplannedTasks";

export function AppSidebar() {
   return (
      <Sidebar>
         <SidebarHeader />
         <SidebarContent>
            <SidebarGroup>
               <UnplannedTasks />
            </SidebarGroup>
            <SidebarGroup />
         </SidebarContent>
         <SidebarFooter />
      </Sidebar>
   );
}
