import { useState } from "react";
import { Dragable } from "../tiny-dnd/dragable";
import { Dropable } from "../tiny-dnd/dropable";
import { twMerge } from "tailwind-merge";

const fakeData: Array<{ id: string; name: string }> = [
  { id: "1", name: "John Doe" },
  { id: "2", name: "Jane Smith" },
  { id: "3", name: "Alice Johnson" },
  { id: "4", name: "Bob Brown" },
  { id: "5", name: "Charlie Davis" },
  { id: "6", name: "Diana Evans" },
  { id: "7", name: "Frank Green" },
  { id: "8", name: "Grace Harris" },
  { id: "9", name: "Henry Jackson" },
  { id: "10", name: "Ivy King" },
] as const;

export function ListExample() {
  const [items, setItems] = useState<
    Array<{
      id: string;
      name: string;
    }>
  >(fakeData);

  function handleMove(id: string, existingId: string) {
    setItems((prev) => {
      const dragIndex = prev.findIndex((item) => item.id === id);
      const existingIndex = prev.findIndex((item) => item.id === existingId);
      console.log("found index of moving value", id, dragIndex);
      if (dragIndex === -1 || existingIndex === -1) {
        return prev; // Invalid index or item not found
      }

      const cp = [...prev];
      const [movedItem] = cp.splice(dragIndex, 1); // Remove the item
      cp.splice(existingIndex, 0, movedItem); // Insert the item at the new position

      return cp;
    });
  }
  return (
    <>
      <div>
        <h1>List</h1>
        <ul>
          {items.map((item) => {
            return (
              <Dragable
                key={item.id}
                value={item.id}
                isDroppable
                onDropValue={handleMove}
              >
                <li
                  className={twMerge(
                    "bg-gray-200 text-black odd:bg-gray-100 even:bg-gray-200 py-2 px-4 cursor-move",
                    "data-[dragging]:opacity-50 data-[dropping]:bg-blue-200 data-[dropping]:opacity-100 ",
                    "transition-colors duration-100"
                  )}
                >
                  {item.name}
                </li>
              </Dragable>
            );
          })}
        </ul>
      </div>
      <Dropable>
        <div className="w-full p-6 bg-red-100">drop zone</div>
      </Dropable>
    </>
  );
}
