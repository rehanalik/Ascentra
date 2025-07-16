"use client";
import React from "react";
import Icons from "../assets/svgs";
import { useToast } from "../context/ToastContext";
import { useDispatch, useSelector } from "react-redux";
import { setShowFetch } from "../store";

function DeleteBlock({ id }: { id: string }) {
  const { showToast } = useToast();
  const { CancelIcon } = Icons;
  const dispatch = useDispatch();
  const showFetch = useSelector((state: any) => state.showFetch.showFetch); // Access the showFetch state

  async function deleteTask() {
    const res = await fetch(`/api/Task/${id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      dispatch(setShowFetch(!showFetch));
      console.log("Delete successfully!");
      showToast("Successfully deleted", "success");
    } else {
      console.error("Delete failed!");
    }
  }

  return (
    <div>
      <CancelIcon onClick={deleteTask} />
    </div>
  );
}

export default DeleteBlock;
