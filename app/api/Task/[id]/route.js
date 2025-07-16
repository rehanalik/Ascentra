import { NextResponse } from "next/server";
import Task from "../../../(models)/Task";
import { connectToDatabase } from "../../../lib/mongoose";

export async function DELETE(req, { params }) {
  console.log("Handling DELETE request");
  try {
    await connectToDatabase();
    const { id } = params;
    const res = await Task.findByIdAndDelete(id);
    if (res) {
      return NextResponse.json({ message: "Task deleted!" }, { status: 200 });
    }
  } catch (error) {
    console.error("Error deleting task:", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function GET(req, { params }) {
  console.log("Handling GET request for a specific task");
  try {
    await connectToDatabase();
    const { id } = params;
    const taskData = await Task.findOne({ _id: id });
    if (taskData) {
      return NextResponse.json({ taskData }, { status: 200 });
    }
  } catch (error) {
    console.error("Error fetching task:", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  console.log("Handling PUT request");
  try {
    await connectToDatabase();
    const { id } = params;
    const data = await req.json();
    const res = await Task.findByIdAndUpdate(id, { ...data });

    if (res) {
      return NextResponse.json(
        { message: "Update data successfully!" },
        { status: 200 }
      );
    } else {
      return NextResponse.json({ message: "Task not found!" }, { status: 404 });
    }
  } catch (error) {
    console.error("Error updating task:", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
