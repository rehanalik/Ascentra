import React from "react";

function StatusDisplay({status}:any) {
  return (
    <div className=" p-2 bg-yellow flex text-center rounded-xl">
      <p>{status}</p>
    </div>
  );
}

export default StatusDisplay;
