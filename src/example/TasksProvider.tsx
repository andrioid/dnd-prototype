import { useState } from "react";
import { taskData } from "./taskData";
import { TasksContext } from "./TasksContext";

export function TasksProvider({ children }: { children: React.ReactNode }) {
   const [tasks, setTasks] = useState(taskData);

   return <TasksContext.Provider value={{ tasks, setTasks }}>{children}</TasksContext.Provider>;
}
