import { createContext } from "react";
import { Task } from "./plan-example";

export const TasksContext = createContext<
   | {
        tasks: Array<Task>;
        setTasks: React.Dispatch<React.SetStateAction<Array<Task>>>;
     }
   | undefined
>(undefined);
