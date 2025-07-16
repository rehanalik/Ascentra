"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "../context/ToastContext";
import { setShowFetch } from "../store";
import { useDispatch, useSelector } from "react-redux";

type Props = {
  data?: any;
  editMode?: boolean;
};

export const TaskForm = ({ data, editMode }: Props) => {
  const [users, setUsers] = useState([]);
  const { showToast } = useToast();
  const router = useRouter();
  const [formData, setFormData] = useState<any>({
    title: "",
    description: "",
    status: "Todo",
    progress: 0,
    priority: 1,
    department: "Development",
    assignedTo: "",
    dueDate: "",
  });

  const dispatch = useDispatch();
  const showFetch = useSelector((state: any) => state.showFetch.showFetch); // Access the showFetch state

  const inputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    if (inputRef.current) {
      inputRef.current.showPicker(); // For modern browsers that support the showPicker method
      inputRef.current.focus();
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      const res = await fetch("/api/user");
      const data = await res.json();
      setUsers(data.users);
    };

    fetchUsers();
    if (editMode) {
      setFormData({
        title: data?.title,
        description: data?.description,
        status: data?.status,
        progress: data?.progress,
        priority: data?.priority,
        department: data?.department,
        assignedTo: data?.assignedTo,
        dueDate: data?.dueDate
          ? new Date(data.dueDate).toISOString().split("T")[0]
          : "",
      });
    }
  }, [editMode]);

  const handleChange = (e: any) => {
    const name = e.target.name;
    const value = e.target.value;
    setFormData((prevState: any) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const createTask = async (e: any) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    if (!token) {
      showToast("No token found", "error");
      return;
    }

    const taskData = {
      ...formData,
      dueDate: new Date(formData.dueDate),
    };

    const res = await fetch("/api/Task", {
      method: "POST",
      body: JSON.stringify(taskData),
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.ok) {
      router.refresh();
      dispatch(setShowFetch(!showFetch));
      router.push("/");
      showToast("Successfully created!", "success");
    } else {
      showToast("Error in creating task", "error");
    }
  };

  const updateTask = async (e: any) => {
    e.preventDefault();

    const updatedData = {
      ...formData,
      dueDate: new Date(formData.dueDate),
    };

    const res = await fetch(`/api/Task/${data._id}`, {
      method: "PUT",
      body: JSON.stringify(updatedData),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (res.ok) {
      router.refresh();
      dispatch(setShowFetch(!showFetch));
      router.push("/");
      showToast("Successfully updated!", "success");
    } else {
      showToast("Error in updating task", "error");
    }
  };

  return (
    <div className="flex flex-col justify-center my-8 mx-10">
      <h3 className="font-semibold text-2xl mb-6 text-center text-gray-800">
        {editMode ? "Update Task" : "Create Task"}
      </h3>

      <form
        className="flex flex-col space-y-5"
        method="POST"
        onSubmit={editMode ? updateTask : createTask}
      >
        {/** Title Input */}
        <div>
          <label className="font-medium text-lg mb-2">Title</label>
          <input
            className="w-full rounded-lg p-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
            name="title"
            type="text"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter task title"
            required
          />
        </div>

        {/** Description Input */}
        <div>
          <label className="font-medium text-lg mb-2">Description</label>
          <textarea
            className="w-full rounded-lg p-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
            rows={4}
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter task description"
            required
          />
        </div>

        {/** Progress Slider */}
        <div>
          <label className="font-medium text-lg mb-2">Progress</label>
          <input
            className="w-full h-2 bg-gray-200 rounded-lg"
            type="range"
            min={0}
            max={100}
            name="progress"
            value={formData.progress}
            onChange={handleChange}
          />
        </div>

        {/** Department Select */}
        <div>
          <label className="font-medium text-lg mb-2">Department</label>
          <div className="relative">
            <select
              className="w-full rounded-lg p-3 pl-3 pr-10 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 appearance-none"
              name="department"
              value={formData.department}
              onChange={handleChange}
            >
              <option value="Development">Development</option>
              <option value="Design">Design</option>
              <option value="QA">QA (Quality Assurance)</option>
              <option value="Sales">Sales</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg
                className="w-4 h-4 text-gray-400" // Adjust the size and color as needed
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
        </div>

        {/** Priority Radio Buttons */}
        <div>
          <label className="font-medium text-lg mb-2">Priority</label>
          <div className="flex space-x-5">
            {[1, 2, 3, 4, 5].map((priority) => (
              <div key={priority} className="flex items-center">
                <input
                  type="radio"
                  name="priority"
                  value={priority}
                  checked={formData.priority == priority}
                  onChange={handleChange}
                  id={`priority-${priority}`}
                  className="mr-2"
                />
                <label
                  htmlFor={`priority-${priority}`}
                  className="text-gray-700"
                >
                  {priority}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/** Status Select */}
        <div>
          <label className="font-medium text-lg mb-2">Status</label>
          <div className="relative">
            <select
              className="w-full rounded-lg p-3 pl-3 pr-10 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 appearance-none"
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="To Do">To Do</option>
              <option value="In Progress">In Progress</option>
              <option value="In Review">In Review</option>
              <option value="On Hold">On Hold</option>
              <option value="Completed">Completed</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg
                className="w-4 h-4 text-gray-400" // Adjust the size and color as needed
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
        </div>

        {/** Assign to Select */}
        <div>
          <label className="font-medium text-lg mb-2">Assign to</label>
          <div className="relative">
            <select
              className="w-full rounded-lg p-3 pl-3 pr-10 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 appearance-none"
              name="assignedTo"
              value={formData.assignedTo}
              onChange={handleChange}
            >
              <option value="">Select user</option>
              {users?.map((user: { _id: string; email: string }) => (
                <option key={user._id} value={user._id}>
                  {user.email}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg
                className="w-4 h-4 text-gray-400" // Adjust the size and color as needed
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
        </div>

        {/** Due Date Input */}
        <div onClick={handleClick}>
          <label className="font-medium text-lg mb-2">Due Date</label>
          <input
            ref={inputRef}
            id="dueDate"
            className="w-full rounded-lg p-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
            name="dueDate"
            type="date"
            value={formData.dueDate}
            onChange={handleChange}
          />
        </div>

        {/** Submit Button */}
        <button
          className="uppercase text-lg w-full mx-auto px-6 bg-blue-600 hover:bg-blue-700 rounded-md flex justify-center items-center py-3 text-[#000] font-bold shadow-md transition duration-300 ease-in-out transform hover:scale-105"
          type="submit"
        >
          {editMode ? "Update" : "Create"}
        </button>
      </form>
    </div>
  );
};
