"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { setLocalStorage, getLocalStorage } from "./utils/localStorage"; // Adjust path as necessary
import Navbar from "./(components)/Navbar";
import Sidebar from "./(components)/Sidebar"; // Your Sidebar component
import { ToastProvider } from "./context/ToastContext"; // Adjust the import path as necessary
import { Provider } from "react-redux";

import store from "./store/index";

const SHOW_LOADER_KEY = "showLoader";
const THIRTY_MINUTES = 30 * 60 * 1000; // 30 minutes in milliseconds

export default function App({ children }: any) {
  const [showLoader, setShowLoader] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const searchParams = useSearchParams();
  const [editMode, setEditMode] = useState(false);
  const [ticketData, setTicketData] = useState(null); // To store the ticket data
  const [loadingData, setLoadingData] = useState(false); // For data loading state

  // Function to fetch ticket data based on ID
  const fetchTicketData = async (ticketId: string) => {
    setLoadingData(true); // Start loading
    try {
      const res = await fetch(`/api/Task/${ticketId}`);
      if (res.ok) {
        const data = await res.json();
        setTicketData(data.taskData); // Store the fetched ticket data
      } else {
        setTicketData(null); // Handle error state
      }
    } catch (error) {
      console.error("Error fetching ticket data:", error);
      setTicketData(null); // Reset on error
    }
    setLoadingData(false); // End loading
  };

  // Detect URL parameter changes
  useEffect(() => {
    const taskId = searchParams.get("task"); // Get the 'task' param from the URL
    if (taskId === "new") {
      setIsSidebarOpen(true);
      setEditMode(false); // Open sidebar in create mode
      setTicketData(null); // Clear ticket data for new task
    } else if (taskId) {
      setIsSidebarOpen(true);
      setEditMode(true); // Open sidebar in edit mode
      setTicketData(null); // Clear existing data before fetching new data
      fetchTicketData(taskId); // Fetch ticket data for edit mode
    } else {
      setIsSidebarOpen(false); // Close sidebar if no 'task' param
      setTicketData(null); // Clear ticket data when sidebar is closed
    }
  }, [searchParams]);

  // Loader effect
  useEffect(() => {
    const loaderTime = getLocalStorage(SHOW_LOADER_KEY);
    const now = new Date().getTime();

    if (!loaderTime || now - parseInt(loaderTime) > THIRTY_MINUTES) {
      setShowLoader(true);
      setLocalStorage(SHOW_LOADER_KEY, now.toString()); // Store the current timestamp
    } else {
      setTimeout(() => {
        setShowLoader(false);
      }, 1000);
    }

    if (showLoader) {
      const timer = setTimeout(() => setShowLoader(false), 3000); // Show loader for 3 seconds
      return () => clearTimeout(timer);
    }
  }, [showLoader]);

  const clearTaskParam = () => {
    const params = new URLSearchParams(window.location.search);
    params.delete("task"); // Clear the 'task' param
    window.history.replaceState(
      {},
      "",
      `${window.location.pathname}?${params}`
    ); // Update the URL without reloading
  };

  return (
    <div>
      {showLoader ? (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="text-white text-xl">Loading...</div>
        </div>
      ) : (
        <Provider store={store}>
          <ToastProvider>
            <div className="flex flex-col h-screen max-h-screen">
              <Navbar />
              <div className="flex-grow overflow-y-auto bg-slate-600">
                {children}
              </div>
              {/* Render Sidebar only when data is loaded */}
              {isSidebarOpen && !loadingData && (
                <Sidebar
                  isOpen={isSidebarOpen} // Control from parent
                  data={ticketData} // Pass the fetched ticket data
                  editMode={editMode} // Pass the edit mode
                  onClose={() => {
                    setIsSidebarOpen(false); // Close the sidebar
                    clearTaskParam(); // Clear the task param from URL
                  }} // Close function passed down
                />
              )}
            </div>
          </ToastProvider>
        </Provider>
      )}
    </div>
  );
}
