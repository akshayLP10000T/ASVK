import React, { useState } from "react";
import Collaborator from "./Collaborator";
import { User } from "@/types/user";

interface DraggableBoxProps {
  users: User[];
}

const DraggableBox: React.FC<DraggableBoxProps> = ({ users }) => {
  const [isMinimized, setIsMinimized] = useState(false);

  const handleDrag = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const box = e.currentTarget;
    const offsetX = e.clientX - box.getBoundingClientRect().left;
    const offsetY = e.clientY - box.getBoundingClientRect().top;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      box.classList.remove("bottom-3");
      box.classList.remove("right-3");
      box.style.left = `${moveEvent.clientX - offsetX}px`;
      box.style.top = `${moveEvent.clientY - offsetY}px`;
    };

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  return (
    <div
      className="absolute bg-white dark:bg-zinc-800 shadow-lg rounded-lg border border-zinc-300 dark:border-zinc-700 min-w-64 w-fit p-4 cursor-grab bottom-3 right-3"
      onMouseDown={handleDrag}
    >
      <div className="flex justify-between items-center mb-2">
        <h4 className="text-lg font-medium text-zinc-800 dark:text-zinc-100">
          Collaborators
        </h4>
        <button
          onClick={() => setIsMinimized(!isMinimized)}
          className="text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-100"
        >
          {isMinimized ? "➕" : "➖"}
        </button>
      </div>
      {!isMinimized && (
        <div className="space-y-2">
          {users.map((user: User) => (
            <Collaborator key={user._id} user={user} />
          ))}
        </div>
      )}
    </div>
  );
};

export default DraggableBox;
