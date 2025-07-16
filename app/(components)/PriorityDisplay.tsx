import React, { useState } from "react";
import Icons from "../assets/svgs";


function PriorityDisplay({priority} : any) {
  const { FireIcon, DarkFireIcon } = Icons;
  const icons:any = [];

  const maxPriority = 5;

  for (let i = 0; i < maxPriority; i++) {
    icons.push(i < priority ? <DarkFireIcon key={i} /> : <FireIcon key={i} />);
  }

  return <div className="flex gap-1">{icons}</div>;
}

export default PriorityDisplay;
