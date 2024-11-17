import { ComponentProps } from "react";
import { twMerge } from "tailwind-merge";
import { Dragable } from "../tiny-dnd/dragable";

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
  { id: "1", name: "Zero Cool" },
  { id: "2", name: "Acid Burn" },
  { id: "3", name: "Cerialkiller" },
];

export const days = [
  "2024-01-01",
  "2024-01-02",
  "2024-01-03",
  "2024-01-04",
  "2024-01-05",
  "2024-01-06",
  "2024-01-07",
];

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
          <TaskCardInner
            task={task}
            className="-rotate-3 drop-shadow-xl opacity-100"
          />
        </div>
      )}
    >
      <div
        // Container used for padding and transition stuff
        // Child used for card stylings
        className={twMerge(
          "group/drag select-none cursor-grab",
          "transition-[padding] duration-150 ease-linear",
          "data-[receiving]:pt-16 data-[dragging]:opacity-50"
        )}
      >
        <TaskCardInner task={task} />
      </div>
    </Dragable>
  );
}

function TaskCardInner({
  task,
  className,
}: {
  task: Task;
  className?: string;
}) {
  return (
    <div
      className={twMerge(
        "bg-white p-4 rounded-md border max-w-48 overflow-hidden truncate text-wrap text-sm",
        task.loading &&
          "border-t-2 border-x-0 border-b-0 border-orange-200 text-gray-400 cursor-wait",
        className
      )}
    >
      {task.name}
    </div>
  );
}
