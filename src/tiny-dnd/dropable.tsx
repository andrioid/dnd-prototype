import { Slot } from "@radix-ui/react-slot";
import { ReactNode, useId, useRef } from "react";
import { twMerge } from "tailwind-merge";
import { DragData } from "./dragable";
import { DRAGABLE_CANDROP, DRAGDATA_ELEMENT_TYPE, DROPABLE_RECEIVING, getDataset } from "./utils";

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
   onDropData?: (data: DragData<T>) => void;
}) {
   const id = useId();
   const ref = useRef<HTMLDivElement | null>(null);
   const Comp = asChild ? Slot : "div";

   // Create handlers for drag events. E.g. handleOnDrop, handleOnDragOver, etc.

   function handleDrop(e: React.DragEvent<HTMLDivElement>) {
      if (!ref.current) return; // no point if no ref
      e.preventDefault();
      const [value, data] = getDataset<T>(e);

      // Cleanup
      delete e.currentTarget.dataset[DROPABLE_RECEIVING];
      //delete e.currentTarget.dataset[DRAGABLE_DRAGGING];
      //delete ref.current.dataset.dropping;

      onDropValue?.(value);
      if (data) {
         onDropData?.(data);
      }
   }

   function handleDragOver(e: React.DragEvent<HTMLDivElement>) {
      e.preventDefault();
      e.currentTarget.dataset[DROPABLE_RECEIVING] = DROPABLE_RECEIVING;
      const dte = e.dataTransfer.types.find((type) => type.startsWith(DRAGDATA_ELEMENT_TYPE));
      if (dte) {
         const [_, dragableElementId] = dte.split("|");
         const dragEl = document.getElementById(dragableElementId);
         if (dragEl) {
            dragEl.dataset[DRAGABLE_CANDROP] = DRAGABLE_CANDROP;
         }
      }

      // TODO: Can we mark the dragable element with DROPABLE?
      e.dataTransfer.dropEffect = "move";

      //e.dataTransfer.dropEffect = "move";
   }
   function handleDragExit(e: React.DragEvent<HTMLDivElement>) {
      const dte = e.dataTransfer.types.find((type) => type.startsWith(DRAGDATA_ELEMENT_TYPE));
      if (dte) {
         const [_, dragableElementId] = dte.split("|");
         const dragEl = document.getElementById(dragableElementId);
         if (dragEl) {
            delete dragEl.dataset[DRAGABLE_CANDROP];
         }
      }

      delete e.currentTarget.dataset[DROPABLE_RECEIVING];
   }

   /* dragable only?
   function handleDragEnd(e: React.DragEvent<HTMLDivElement>) {
      //delete e.currentTarget.dataset[DRAGABLE_DRAGGING];
      delete e.currentTarget.dataset[DROPABLE_RECEIVING];
   }
   */

   function handleDragLeave(e: React.DragEvent<HTMLDivElement>) {
      //delete e.currentTarget.dataset[DRAGABLE_DRAGGING];
      const dte = e.dataTransfer.types.find((type) => type.startsWith(DRAGDATA_ELEMENT_TYPE));
      if (dte) {
         const [_, dragableElementId] = dte.split("|");
         const dragEl = document.getElementById(dragableElementId);
         if (dragEl) {
            delete dragEl.dataset[DRAGABLE_CANDROP];
         }
      }

      delete e.currentTarget.dataset[DROPABLE_RECEIVING];
   }

   function handleDragEnter(e: React.DragEvent<HTMLDivElement>) {
      e.preventDefault();
   }

   return (
      <Comp
         id={id}
         ref={ref}
         onDrop={handleDrop}
         onDragOver={handleDragOver}
         onDragExit={handleDragExit}
         //onDragEnd={handleDragEnd}
         onDragEnter={handleDragEnter}
         onDragLeave={handleDragLeave}
         className={twMerge("data-[receiving]:bg-blue-100", className)}
         {...props}
      >
         {children}
      </Comp>
   );
}
