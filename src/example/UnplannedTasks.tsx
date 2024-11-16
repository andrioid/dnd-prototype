import { TaskCard } from "./task-card";
import { useTasksContext } from "./useTasksContext";

export function UnplannedTasks() {
   const { tasks } = useTasksContext();

   return (
      <div className="p-6 mt-8 flex flex-col gap-4">
         <h1>Unplanned</h1>
         {tasks
            .filter((task) => task.employeeId.length === 0)
            .map((task) => (
               <TaskCard key={task.id} task={task} />
            ))}
      </div>
   );
}
