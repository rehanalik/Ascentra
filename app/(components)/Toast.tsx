import React, { useEffect } from "react";
import Icons from "../assets/svgs";

type ToastProps = {
  message: string;
  type: string;
  id: number;
  onClose: (id: number) => void;
};

const Toast = ({ message, type, id, onClose }: ToastProps) => {
  const { CancelIcon } = Icons;

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(id);
    }, 5000); // Automatically close after 5 seconds

    return () => clearTimeout(timer);
  }, [id, onClose]);

  return (
    <div
      className={` bg-white toast ${type} fixed bottom-4 right-4 p-4 rounded-lg shadow-lg flex items-center justify-between text-white`}
    >
      <span className=" text-[16px] font-medium text-black">{message}</span>
      <button
        className="ml-4 bg-transparent border-none cursor-pointer"
        onClick={() => onClose(id)}
      >
        <CancelIcon />
      </button>
    </div>
  );
};

export default Toast;
