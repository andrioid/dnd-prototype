import { MutableRefObject, ReactNode, useCallback, useLayoutEffect, useMemo, useRef } from "react";
import { createRoot } from "react-dom/client";

// TODO: Debounce!
export function useGhostElement(drag: MutableRefObject<HTMLDivElement | null>, render: ((parentEl: HTMLDivElement | null) => ReactNode) | undefined) {
   const ghostRef = useRef<HTMLDivElement | null>(null);
   useLayoutEffect(() => {
      if (!render) return;
      if (!drag || !drag.current) return;
      const dc = drag.current;

      dc.addEventListener("dragstart", handleDragStart);
      dc.addEventListener("dragend", handleDragEnd);
      document.addEventListener("mousemove", debouncedHandleMouseMove);
      return () => {
         document.removeEventListener("mousemove", debouncedHandleMouseMove);
         dc.removeEventListener("dragstart", handleDragStart);
         dc.removeEventListener("dragend", handleDragEnd);
         if (ghostRef.current) {
            ghostRef.current.remove();
         }
      };
   }, [drag, render]);

   const handleDragStart = useCallback(
      (e: DragEvent) => {
         if (!render) return; // No point if there's nothing to render
         console.log("[ghost] dragstart", e.currentTarget);
         if (!drag.current) return;
         drag.current.style.visibility = "hidden";
         const el = document.createElement("div");
         const root = createRoot(el!);
         document.body.append(el);
         el.style.position = "fixed";
         el.style.left = "0";
         el.style.top = "0";
         el.style.zIndex = "20";
         el.style.userSelect = "none";
         el.style.transform = "translate(calc(1px * var(--x)), calc(1px * var(--y))";
         ghostRef.current = el;
         // WHY IS GETTING MOUSE COORDINATES SO HARD?!
         root.render(<>{render(null)}</>);
      },
      [drag, render, ghostRef],
   );

   function handleDragEnd(e: DragEvent) {
      if (ghostRef.current) {
         ghostRef.current.remove();
      }
      console.log("[ghost] drag-end");
   }

   const debouncedHandleMouseMove = useMemo(() => {
      const handleMouseMove = (e: MouseEvent) => {
         e.preventDefault();
         e.stopPropagation();
         window.requestAnimationFrame(() => {
            if (!ghostRef.current) return;
            document.documentElement.style.setProperty("--x", `${e.clientX}`);
            document.documentElement.style.setProperty("--y", `${e.clientY}`);
            //ghostRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
            //ghostRef.current.style.left = `${e.clientX}`;
            //ghostRef.current.style.top = `${e.clientY}`;
         });
      };

      //return debounce(handleMouseMove, 5);
      return handleMouseMove;
   }, []);
}
