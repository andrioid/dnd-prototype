import { Slot } from "@radix-ui/react-slot";
import { ReactNode, useRef } from "react";
import { twMerge } from "tailwind-merge";

export function Dropable<T extends object>({
   children,
   asChild = true,
   onDropData,
   onDropValue,
   className,
   ...props
}: {
   children: ReactNode;
   asChild?: boolean;
   className?: string;
   onDropValue?: (value: string) => void;
   onDropData?: (data: T) => void;
}) {
   const ref = useRef<HTMLDivElement | null>(null);
   const Comp = asChild ? Slot : "div";

   // Create handlers for drag events. E.g. handleOnDrop, handleOnDragOver, etc.

   function handleDrop(e: React.DragEvent<HTMLDivElement>) {
      e.preventDefault();
      if (!ref.current) {
         console.warn("Attempting to use drop zone without ref");
         return;
      }
      const value = e.dataTransfer.getData("text/plain");
      const data = e.dataTransfer.getData("application/json");
      delete e.currentTarget.dataset.dropping;
      delete e.currentTarget.dataset.dragging;
      delete ref.current.dataset.dropping;

      onDropValue?.(value);
      if (data) {
         const dataJ = JSON.parse(data) as T;
         onDropData?.(dataJ);
      }
   }

   function handleDragOver(e: React.DragEvent<HTMLDivElement>) {
      e.preventDefault();
      e.currentTarget.dataset.dropping = "dropping";
      e.dataTransfer.dropEffect = "move";

      //e.dataTransfer.dropEffect = "move";
   }
   function handleDragExit(e: React.DragEvent<HTMLDivElement>) {
      delete e.currentTarget.dataset.dropping;
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
         onDrop={handleDrop}
         onDragOver={handleDragOver}
         onDragExit={handleDragExit}
         onDragEnd={handleDragEnd}
         //onDragEnter={handleDragEnter}
         onDragLeave={handleDragLeave}
         className={twMerge("data-[dropping]:bg-blue-50", className)}
         {...props}
      >
         {children}
      </Comp>
   );
}
