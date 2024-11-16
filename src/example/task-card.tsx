import { ComponentProps, useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";
import { Dragable } from "../tiny-dnd/dragable";
import { DRAGABLE_CANDROP } from "../tiny-dnd/utils";

export type Task = {
   id: string;
   employeeId: Array<string | null>;
   day: Array<string>;
   name: string;
   loading?: boolean;
};

export const employees: Array<{
   id: string;
   name: string;
}> = [
   { id: "1", name: "Mikkel" },
   { id: "2", name: "Lars" },
   { id: "3", name: "Andri" },
];

export const days = ["2024-01-01", "2024-01-02", "2024-01-03", "2024-01-04", "2024-01-05", "2024-01-06", "2024-01-07"];

export function TaskCard({
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
         disabled={task.loading}
         data={task}
         renderDragLayer={() => (
            // Example with shadow. The padding is necessary so it's not cut off
            <div key={task.id} className="p-4">
               <TaskCardInner task={task} className="-rotate-3 drop-shadow-xl opacity-100" />
            </div>
         )}
      >
         <div
            // Container used for padding and transition stuff
            // Child used for card stylings
            className={twMerge(
               "group/drag select-none cursor-grab",
               "transition-[padding] duration-150 ease-linear",
               "data-[receiving]:pt-16 data-[dragging]:opacity-50",
            )}
         >
            <TaskCardInner task={task} />
         </div>
      </Dragable>
   );
}

function TaskCardInner({ task, className }: { task: Task; className?: string }) {
   return (
      <div
         className={twMerge(
            "bg-white p-4 rounded-md border max-w-48 overflow-hidden truncate text-wrap text-sm",
            task.loading && "border-t-2 border-x-0 border-b-0 border-orange-200 text-gray-400 cursor-wait",
            className,
         )}
      >
         {task.name}
      </div>
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
