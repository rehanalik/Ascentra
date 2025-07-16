import React from "react";
import PriorityDisplay from "./PriorityDisplay";
import DeleteBlock from "./DeleteBlock";
import ProgressDisplay from "./ProgressDisplay";
import StatusDisplay from "./StatusDisplay";
import { useRouter } from "next/navigation"; // Using router for updating the query

function TicketCard({ item }: any) {
  const router = useRouter();

  // Function to format the timestamp
  function format(timestamp: any) {
    const options: any = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    };

    const date = new Date(timestamp);
    const formatDateTime = date.toLocaleString("en-US", options);
    return formatDateTime;
  }

  // Function to handle ticket click and trigger edit mode by updating the URL params
  const handleEditTicket = () => {
    const params = new URLSearchParams(window.location.search);
    params.set("task", item._id); // Set the task id in the query parameter
    router.push(`?${params.toString()}`); // Update URL without page refresh
  };

  return (
    <div className=" bg-white rounded-xl h-auto p-4 hover:bg-slate-50 cursor-pointer">
      <div className="flex justify-between">
        <PriorityDisplay priority={item.priority} />
        <DeleteBlock id={item._id} />
      </div>

      <div onClick={handleEditTicket}>
        <h2 className="mt-2">{item.title}</h2>

        <hr className=" h-px text-sky-300 w-full"></hr>

        <p className="mt-2">{item.description}</p>

        <p className="mt-2">{format(item.createdAt)}</p>

        <div
          className="flex justify-between w-full mt-2"
          style={{ alignItems: "center" }}
        >
          <div className="w-64">
            <ProgressDisplay progress={item.progress} />
          </div>

          <div className="">
            <StatusDisplay status={item.status} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default TicketCard;
