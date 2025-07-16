"use client";

import { useEffect, useState } from "react";
import TicketCard from "./(components)/TicketCard";
import TaskSchema from "./interface/Task";
import Icons from "./assets/svgs";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";

const fetchTasks = async () => {
  try {
    const res = await fetch("/api/Task", {
      cache: "no-store",
    });
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch tasks:", error);
    return { task: [] };
  }
};

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [tasks, setTasks] = useState<TaskSchema[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDepartment, setSelectedDepartment] = useState("All");
  const { BotIcon } = Icons;
  const dispatch = useDispatch();
  const showFetch = useSelector((state: any) => state.showFetch.showFetch); // Access the showFetch state
  console.log({ showFetch });

  const loadTasks = async () => {
    setLoading(true);
    const data = await fetchTasks();
    setTasks(data.task);
    setLoading(false);
  };

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      setIsLoggedIn(!!token);
    };

    checkAuth();
    if (isLoggedIn) {
      loadTasks();
    }
  }, [isLoggedIn, showFetch]);

  // useEffect(() => {
  //   loadTasks();
  // }, [showFetch]);

  if (!isLoggedIn) {
    return (
      <div className="flex flex-col items-center mt-[260px]">
        <BotIcon className="w-14 h-14 mb-4" />
        <h2 className="text-xl text-white font-bold">
          Welcome to Task Manager
        </h2>
        <p className="mt-2 text-[#b4b0b0]">Please login to view tasks.</p>
      </div>
    );
  }

  const departmentList = ["Development", "Design", "QA", "Sales"];

  const filteredDepartments =
    selectedDepartment === "All"
      ? departmentList
      : departmentList.filter(
          (department) => department === selectedDepartment
        );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <div className="m-10">
      <div className="relative w-[182px] mb-4">
        <select
          className="w-full rounded-lg p-3 pl-3 pr-10 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 appearance-none"
          onChange={(e) => setSelectedDepartment(e.target.value)}
        >
          <option value="All">All Departments</option>
          <option value="Development">Development</option>
          <option value="Design">Design</option>
          <option value="QA">QA</option>
          <option value="Sales">Sales</option>
        </select>

        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <svg
            className="w-4 h-4 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 10l5 5 5-5"
            />
          </svg>
        </div>
      </div>

      {filteredDepartments.map((department) => {
        const departmentTasks = tasks.filter(
          (task) => task.department === department
        );

        return (
          <div key={department} className="mb-8">
            <h3 className="text-[#fff] font-semibold text-[24px] mb-2">
              {department}
            </h3>
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
              {departmentTasks.length > 0 ? (
                departmentTasks.map((item, index) => (
                  <div
                    key={index}
                    className="bg-white shadow-md rounded-lg overflow-hidden transition-transform transform hover:scale-105"
                  >
                    <TicketCard item={item} />
                  </div>
                ))
              ) : (
                <div className="text-[#b4b0b0]">No tasks available</div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
