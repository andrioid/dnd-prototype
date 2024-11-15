import { Slot } from "@radix-ui/react-slot";
import { ReactNode, useRef } from "react";
import { twMerge } from "tailwind-merge";

export function Dragable<T extends object>({
   children,
   asChild = true,
   value: value,
   data,
   isDroppable,
   onDropData,
   onDropValue,
   className,
   ...props
}: {
   isDroppable?: boolean;
   children: ReactNode;
   asChild?: boolean;
   value?: string;
   data?: T;
   className?: string;
   onDropValue?: (newValue: string, oldValue: string) => void;
   onDropData?: (newData: T, oldDate: T) => void;
}) {
   const Comp = asChild ? Slot : "div";
   const ref = useRef<HTMLDivElement | null>(null);

   function isSelf(e: React.DragEvent<HTMLDivElement>) {
      if (!ref.current) return false;
      return value === e.dataTransfer.getData("text/plain");
   }

   function handleDrop(e: React.DragEvent<HTMLDivElement>) {
      if (!isDroppable || !ref.current) return;
      if (isSelf(e)) return;
      e.preventDefault();
      const v = e.dataTransfer.getData("text/plain");
      const d = e.dataTransfer.getData("application/json");
      delete e.currentTarget.dataset.dropping;
      delete e.currentTarget.dataset.dragging;
      delete ref.current.dataset.dragging;
      onDropValue?.(v, value ?? "");
      if (d) {
         const dataJ = JSON.parse(d) as T;
         onDropData?.(dataJ, data ?? ({} as T));
      }
   }

   function handleDragOver(e: React.DragEvent<HTMLDivElement>) {
      if (!isDroppable) return;
      if (isSelf(e)) return;
      e.preventDefault();
      // TODO: Exclude self from dropping
      e.currentTarget.dataset.dropping = "dropping";
      e.dataTransfer.dropEffect = "move";
   }

   function handleDragExit(e: React.DragEvent<HTMLDivElement>) {
      if (!isDroppable) return;
      delete e.currentTarget.dataset.dropping;
   }

   function handleDragStart(e: React.DragEvent<HTMLDivElement>) {
      e.currentTarget.dataset.dragging = "dragging";
      e.dataTransfer.setData("text/plain", value ?? "");
      if (data) {
         e.dataTransfer.setData("application/json", JSON.stringify(data));
      }
   }

   function handleDragEnd(e: React.DragEvent<HTMLDivElement>) {
      delete e.currentTarget.dataset.dragging;
      delete e.currentTarget.dataset.dropping;
   }

   function handleDragLeave(e: React.DragEvent<HTMLDivElement>) {
      delete e.currentTarget.dataset.dragging;
      delete e.currentTarget.dataset.dropping;
   }

   return (
      <Comp
         ref={ref}
         draggable
         onDrop={handleDrop}
         onDragOver={isDroppable ? handleDragOver : undefined}
         onDragExit={handleDragExit}
         onDragStart={handleDragStart}
         onDragLeave={handleDragLeave}
         onDragEnd={handleDragEnd}
         className={twMerge("cursor-grab data-[dragging]:opacity-60", className)}
         {...props}
      >
         {children}
      </Comp>
   );
}
