import { Dropable } from "@/tiny-dnd/dropable";
import { produce } from "immer";
import { Fragment } from "react";
import { days, employees, Task, TaskCard } from "./task-card";
import { useTasksContext } from "./useTasksContext";

export function PlanExample() {
   const { setTasks, tasks } = useTasksContext();

   async function handleTaskDrop(taskId: string, employeeId: string | null, day: string) {
      const snapShot = tasks.find((task) => task.id === taskId);
      if (!snapShot) return;

      // Optimistic update
      setTasks((prev) =>
         produce(prev, (draft: Array<Task>) => {
            const idx = tasks.findIndex((task) => task.id === taskId);
            if (idx === -1) return draft;
            draft[idx].employeeId = employeeId ? [employeeId] : [];
            draft[idx].day = [day];
            draft[idx].loading = true;
            return draft;
         }),
      );
      try {
         await simulateBackendCall();
      } catch (err) {
         setTasks((prev) =>
            produce(prev, (draft: Array<Task>) => {
               const idx = tasks.findIndex((task) => task.id === taskId);
               if (idx === -1) return draft;
               draft[idx] = snapShot;
               return draft;
            }),
         );
      } finally {
         setTasks((prev) =>
            produce(prev, (draft: Array<Task>) => {
               const idx = tasks.findIndex((task) => task.id === taskId);
               if (idx === -1) return draft;
               draft[idx].loading = false;
               return draft;
            }),
         );
      }
   }

   return (
      <div className="overflow-auto">
         <div className="grid gap-2 items-center grid-cols-8plus grid-rows-2 overflow-x-auto">
            {employees.map((employee) => (
               <Fragment key={employee.id}>
                  <div>{employee.name}</div>
                  {days.map((day) => {
                     return (
                        <Dropable
                           key={`${employee.id}-${day}`}
                           onDropValue={(taskId) => handleTaskDrop(taskId, employee.id, day)}
                           onDropData={(data) => console.log("dropped data", data)}
                        >
                           <div className="p-2 min-h-32 h-full bg-gray-100">
                              <p className="select-none text-gray-700 text-center text-xs mb-4">{day}</p>
                              {tasks
                                 .filter((task) => task.employeeId.includes(employee.id))
                                 .filter((task) => task.day.includes(day))
                                 .map((task) => (
                                    <TaskCard
                                       key={task.id}
                                       task={task}
                                       isDroppable
                                       onDropValue={(val, existing) => {
                                          // TODO: Get event here, so we can stop propogation, if we want that
                                          console.log(`Dropped ${val} on ${existing}`);
                                       }}
                                       onDropData={(data, existingData) => {
                                          console.log("dropped data", data, existingData);
                                       }}
                                    />
                                 ))}
                           </div>
                        </Dropable>
                     );
                  })}
               </Fragment>
            ))}
         </div>
      </div>
   );
}

const simulateBackendCall = (): Promise<void> => {
   return new Promise((resolve, reject) => {
      setTimeout(() => {
         const randomNumber = Math.floor(Math.random() * 10) + 1;
         if (randomNumber > 1) {
            resolve();
         } else {
            reject(new Error("Backend borked"));
         }
      }, 3000);
   });
};
