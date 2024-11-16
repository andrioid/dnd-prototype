import { ComponentProps, useEffect, useState } from "react";
import { Fragment } from "react/jsx-runtime";
import { twMerge } from "tailwind-merge";
import { Dragable } from "../tiny-dnd/dragable";
import { Dropable } from "../tiny-dnd/dropable";
import { DRAGABLE_CANDROP } from "../tiny-dnd/utils";

type Task = {
   id: string;
   employeeId: Array<string | null>;
   day: Array<string>;
   name: string;
};

const taskData: Array<Task> = [
   { id: "1", employeeId: [], day: ["2024-01-01"], name: "Lay Foundation" },
   { id: "2", employeeId: [], day: ["2024-01-02"], name: "Install Plumbing" },
   { id: "3", employeeId: [], day: ["2024-01-03"], name: "Frame Walls" },
   { id: "4", employeeId: [], day: ["2024-01-01"], name: "Install Electrical" },
   { id: "5", employeeId: [], day: ["2024-01-02"], name: "Insulate Walls" },
   { id: "6", employeeId: [], day: ["2024-01-03"], name: "Install Drywall" },
   { id: "7", employeeId: [], day: ["2024-01-01"], name: "Apply Exterior Paint" },
   { id: "8", employeeId: [], day: ["2024-01-02"], name: "Install Roofing" },
   { id: "9", employeeId: [], day: ["2024-01-03"], name: "Lay Flooring" },
   { id: "10", employeeId: [], day: ["2024-01-01"], name: "Install Cabinets" },
   { id: "11", employeeId: ["1"], day: ["2024-01-02"], name: "Preassigned" },
   { id: "12", employeeId: [], day: ["2024-01-03"], name: "Install Windows" },
   { id: "13", employeeId: [], day: ["2024-01-01"], name: "Install Doors" },
   { id: "14", employeeId: [], day: ["2024-01-02"], name: "Install HVAC" },
   { id: "15", employeeId: [], day: ["2024-01-03"], name: "Install Fixtures" },
   { id: "16", employeeId: [], day: ["2024-01-01"], name: "Apply Interior Paint" },
   { id: "17", employeeId: [], day: ["2024-01-02"], name: "Install Siding" },
   { id: "18", employeeId: [], day: ["2024-01-03"], name: "Install Gutters" },
   { id: "19", employeeId: [], day: ["2024-01-01"], name: "Landscape Yard" },
   { id: "20", employeeId: [], day: ["2024-01-02"], name: "Install Fencing" },
   { id: "21", employeeId: [], day: ["2024-01-03"], name: "Install Driveway" },
   { id: "22", employeeId: [], day: ["2024-01-01"], name: "Install Patio" },
];

const employees: Array<{
   id: string;
   name: string;
}> = [
   { id: "1", name: "Alice" },
   { id: "2", name: "Bob" },
];

const days = ["2024-01-01", "2024-01-02", "2024-01-03", "2024-01-04", "2024-01-05", "2024-01-06", "2024-01-07"];

export function PlanExample() {
   const [tasks, setTasks] = useState(taskData);

   function handleTaskDrop(taskId: string, employeeId: string | null, day: string) {
      setTasks((tasks) =>
         tasks.map((task) =>
            task.id === taskId
               ? {
                    ...task,
                    employeeId: employeeId !== null ? [employeeId] : [],
                    day: [day],
                 }
               : task,
         ),
      );
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
         <div className="bg-green-50 p-6 mt-8 flex flex-wrap flex-row gap-4">
            {tasks
               .filter((task) => task.employeeId.length === 0)
               .map((task) => (
                  <TaskCard key={task.id} task={task} />
               ))}
         </div>
      </div>
   );
}

function TaskCard({
   task,
   isDroppable,
   onDropValue,
   onDropData,
}: {
   task: Task;
   isDroppable?: boolean;
   onDropValue?: ComponentProps<typeof Dragable>["onDropValue"];
   onDropData?: ComponentProps<typeof Dragable>["onDropData"];
}) {
   return (
      <Dragable<Task>
         value={task.id}
         isDroppable={isDroppable}
         onDropValue={onDropValue}
         onDropData={onDropData}
         data={task}
         renderDragLayer={() => (
            <div key={task.id} className="shadow-xl bg-pink-50 p-4 rounded-md">
               {task.name}
            </div>
         )}
      >
         <div
            // Container used for padding and transition stuff
            // Child used for card stylings
            className={twMerge(
               "group/drag select-none cursor-grab",
               "transition-[padding] duration-150 ease-linear",
               "data-[receiving]:pt-16 data-[dropable]:rotate-45",
               "data-[debug]:border-2 data-[debug]:border-pink-200",
            )}
         >
            <div className="bg-white group-data-[dragging]/drag:shadow-xl group-data-[debug]/drag:bg-pnk-100 p-4 rounded-md border ">{task.name}</div>
         </div>
      </Dragable>
   );
}

function DragLayerExample({ parentEl }: { parentEl: HTMLDivElement | null }) {
   const [dropable, setDropable] = useState(false);
   useEffect(() => {
      if (!parentEl) return;
      const observer = new MutationObserver((mutationsList) => {
         for (const mutation of mutationsList) {
            //console.log("attribute change", mutation.attributeName);
            // almost works, if I can get candrop to the parent from dropzone
            if (mutation.type === "attributes" && mutation.attributeName === `data-` + DRAGABLE_CANDROP) {
               const val = !!parentEl.dataset[DRAGABLE_CANDROP];
               setDropable(val);
               //console.log("Dataset changed:", val);
            }
         }
      });

      observer.observe(parentEl, { attributes: true });

      return () => {
         observer.disconnect();
      };
   }, [parentEl]);
   return <div className={twMerge("bg-purple-200 p-6", dropable && "bg-green-200")}>poop</div>;
}
