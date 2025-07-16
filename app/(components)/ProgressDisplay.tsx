import React from "react";

function ProgressDisplay({progress}:any) {
  return (
    <div className=" bg-slate-200 rounded-full w-full">
      <div className={` bg-emerald-200 rounded-full`} style={{width:`${progress}%`}}>
        <div className="text-emerald-200">s</div>
      </div>
    </div>
  );
}

export default ProgressDisplay;
