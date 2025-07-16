import React from "react";
import { TaskForm } from "./TaskForm";

function Sidebar({ isOpen, onClose, data, editMode }: any) {
  return (
    <div
      className={`fixed top-0 right-0 h-full bg-white shadow-lg transition-transform duration-500 ease-in-out z-50 ${
        isOpen ? "translate-x-0 slide-in" : "slide-out"
      }`}
      style={{ width: "500px" }}
    >
      <div className="p-4 h-full flex flex-col">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-2xl text-gray-700 hover:text-gray-900"
        >
          &times;
        </button>
        {/* Scrollable Content Wrapper */}
        <div
          className="overflow-y-auto flex-grow"
          style={{ scrollbarWidth: "none" }}
        >
          <TaskForm data={data} editMode={editMode} />
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
