import { useCanHover } from "@/example/use-canhover";
import { Slot } from "@radix-ui/react-slot";
import { ReactNode, useId, useRef } from "react";
import { createRoot } from "react-dom/client";
import { twMerge } from "tailwind-merge";
import { useGhostElement } from "./use-ghost-element";
import { DRAGABLE_DRAGGING, DROPABLE_RECEIVING, setDataset } from "./utils";

export type DragData<T extends object> = {
   dragableElementId: string;
   data: T | null;
};

export function Dragable<T extends object>({
   children,
   asChild = true,
   value: value,
   data,
   isDroppable,
   onDropData,
   onDropValue,
   className,
   renderDragLayer,
   disabled,
   ...props
}: {
   isDroppable?: boolean;
   children: ReactNode;
   asChild?: boolean;
   value?: string;
   data?: T;
   className?: string;
   disabled?: boolean;
   onDropValue?: (newValue: string, oldValue: string) => void;
   onDropData?: (newData: T, oldDate: T) => void;
   // TODO: I want the dataset for the dragable to be available to the renderDragLayer
   renderDragLayer?: (parentEl: HTMLDivElement | null) => ReactNode;
}) {
   const id = useId();
   const Comp = asChild ? Slot : "div";
   const ref = useRef<HTMLDivElement | null>(null); // Used by the slot
   useGhostElement(ref, renderDragLayer);
   const canHover = useCanHover();

   function isSelf(e: React.DragEvent<HTMLDivElement>) {
      if (!ref.current) return false;
      return value === e.dataTransfer.getData("text/plain");
   }

   // for drop events, the currentTarget is always the receiving element
   // ref.current and currentTarget are the same on drop events too

   function handleDrop(e: React.DragEvent<HTMLDivElement>) {
      console.log("[dragable] dropped");
      if (!isDroppable || !ref.current) return;
      if (isSelf(e)) return;
      e.preventDefault();
      console.log("dropped ref dataset", JSON.stringify(ref.current.dataset));
      console.log("dropped dataset", JSON.stringify(e.currentTarget.dataset));
      const v = e.dataTransfer.getData("text/plain");
      const d = e.dataTransfer.getData("application/json");
      delete e.currentTarget.dataset[DROPABLE_RECEIVING];
      if (isDroppable) {
         delete e.currentTarget.dataset[DRAGABLE_DRAGGING];
      }

      onDropValue?.(v, value ?? "");
      if (d) {
         const dataJ = JSON.parse(d) as T;
         onDropData?.(dataJ, data ?? ({} as T));
      }
   }

   function handleDropableDragOver(e: React.DragEvent<HTMLDivElement>) {
      if (!isDroppable) return;
      if (isSelf(e)) return;
      e.preventDefault();
      e.currentTarget.dataset[DROPABLE_RECEIVING] = DROPABLE_RECEIVING;
      e.dataTransfer.dropEffect = "move";
   }

   function handleDropableDragExit(e: React.DragEvent<HTMLDivElement>) {
      console.log("[dragable] ondragexit");
      if (!isDroppable) return;
      delete e.currentTarget.dataset[DROPABLE_RECEIVING];
   }

   // Responsible for setting the data and preparing all the things
   function handleDragStart(e: React.DragEvent<HTMLDivElement>) {
      if (disabled) return;
      console.log("handle drag start");
      e.currentTarget.dataset[DRAGABLE_DRAGGING] = DRAGABLE_DRAGGING;
      console.log("dataset start", JSON.stringify(e.currentTarget.dataset));

      setDataset({ e, value: value ?? "", data, dragableElementId: id });

      e.dataTransfer.effectAllowed = "move";

      if (false && renderDragLayer && canHover) {
         // Plan:
         // 1. Hide this element
         // 2. Spawn a renderDragLayer element somewhere
         if (ref.current) {
            console.log("hacking stuff");
            ref.current.style.visibility = "hidden";
            const el = document.createElement("div");
            const root = createRoot(el!);
            document.body.append(el);
            el.style.position = "fixed";
            el.style.left = "0";
            el.style.top = "0";
            el.style.zIndex = "20";
            root.render(<>{renderDragLayer(null)}</>);
         }
         // /** This is the craziest hack I've ever made! */
         // const el = document.createElement("div");
         // const root = createRoot(el!);
         // document.body.appendChild(el);
         // root.render(<>{renderDragLayer(null)}</>);
         // console.log("elly!", el);
         // e.dataTransfer.setDragImage(el, 0, 0);
         // setTimeout(() => {
         //    el.remove();
         // }, 0);
      }
   }

   // This is only triggered if the dragged element is released without a valid drop-zone
   function handleDragEnd(e: React.DragEvent<HTMLDivElement>) {
      console.log("[dragable] dragend", JSON.stringify(e.currentTarget.dataset));

      e.preventDefault();
      delete e.currentTarget.dataset[DRAGABLE_DRAGGING];
   }

   // Triggered when we leave a valid drop-zone
   function handleDragLeave(e: React.DragEvent<HTMLDivElement>) {
      console.log("[dragable] dragleave", JSON.stringify(e.currentTarget.dataset));
      delete e.currentTarget.dataset[DROPABLE_RECEIVING];
   }
   return (
      <>
         <Comp
            ref={ref}
            id={id}
            draggable={!disabled}
            onDrop={handleDrop}
            onDragOver={isDroppable ? handleDropableDragOver : undefined}
            onDragExit={handleDropableDragExit}
            onDragStart={handleDragStart}
            onDragLeave={handleDragLeave}
            onDragEnd={handleDragEnd}
            className={twMerge("cursor-grab", className)}
            {...props}
         >
            {children}
         </Comp>
      </>
   );
}
