import { DragEvent } from "react";
import { DragData } from "./dragable";

export const DRAGABLE_CANDROP = "dropable";
export const DRAGABLE_DRAGGING = "dragging";
export const DROPABLE_RECEIVING = "receiving";

export const DRAGDATA_ELEMENT_TYPE = "dragelement";

export function getDataset<T extends object>(e: DragEvent<HTMLDivElement>) {
   const v = e.dataTransfer.getData("text/plain");
   const d = e.dataTransfer.getData("application/json");
   let dj: DragData<T> | null = null;
   if (d) {
      dj = JSON.parse(d);
   }
   return [v, dj] satisfies [typeof v, typeof dj];
}

export function setDataset<T extends object>({
   e,
   value,
   data,
   dragableElementId,
}: {
   dragableElementId: string;
   value: string;
   data?: T;
   e: DragEvent<HTMLDivElement>;
}) {
   // Note: This is converted to lower-case by the browser
   e.dataTransfer.setData(`${DRAGDATA_ELEMENT_TYPE}|${dragableElementId}`, "");

   e.dataTransfer.setData("text/plain", value ?? "");
   if (data) {
      e.dataTransfer.setData(
         "application/json",
         JSON.stringify({
            dragableElementId,
            data,
         } satisfies DragData<T>),
      );
   }
}

export function debounce<T extends (...args: any[]) => void>(func: T, wait: number): (...args: Parameters<T>) => void {
   let timeout: ReturnType<typeof setTimeout> | null = null;
   return function (...args: Parameters<T>) {
      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
   };
}
