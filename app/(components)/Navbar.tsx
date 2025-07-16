"use client";
import React from "react";
import Icons from "../assets/svgs";
import Link from "next/link";
import { useRouter } from "next/navigation";

function Navbar() {
  const { HomeIcon, TaskIcon, LogoutIcon } = Icons;
  const token = localStorage.getItem("token");
  const router = useRouter();

  function handleLogout() {
    localStorage.removeItem("token");

    router.push("/auth/Login");
    router.refresh();
  }

  const handleNewTask = () => {
    const params = new URLSearchParams(window.location.search);
    params.set("task", "new"); // Add a custom parameter for the new task
    router.push(`?${params.toString()}`); // Update the URL query without a full page reload
  };

  return (
    <div className=" bg-lime-100 flex justify-between py-4 px-10">
      <div className="flex gap-x-4">
        <Link href="/">
          <div className="icon">
            <HomeIcon />
          </div>
        </Link>
        <div onClick={handleNewTask}>
          <div className="icon">
            <TaskIcon />
          </div>
        </div>
      </div>
      {/* <div>
        <LogoutIcon />
      </div> */}

      {token ? (
        <h4 className="font-medium cursor-pointer" onClick={handleLogout}>
          Log out
        </h4>
      ) : (
        <Link href={"/auth/Login"}>
          <h4 className="font-medium cursor-pointer">Log in</h4>
        </Link>
      )}
    </div>
  );
}

export default Navbar;
