import { AppSidebar } from "./app-sidebar";
import { SidebarProvider, SidebarTrigger } from "./components/ui/sidebar";
import { PlanExample } from "./example/PlanExample";
import { TasksProvider } from "./example/TasksProvider";
import "./index.css";

function App() {
   return (
      <SidebarProvider>
         <TasksProvider>
            <AppSidebar />
            <div className="p-10 flex-col flex gap-8">
               <SidebarTrigger />
               <PlanExample />
            </div>
         </TasksProvider>
      </SidebarProvider>
   );
}

export default App;
