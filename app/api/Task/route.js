import { NextResponse } from "next/server";
import Task from "../../(models)/Task";
import { connectToDatabase } from "../../lib/mongoose";
import jwt from "jsonwebtoken";

export async function POST(req) {
  console.log("Handling POST request");

  // Extract the token from the Authorization header
  const authHeader = req.headers.get("Authorization");
  if (!authHeader) {
    return NextResponse.json(
      { message: "Authorization token missing" },
      { status: 401 }
    );
  }

  const token = authHeader.split(" ")[1];
  try {
    // Verify and decode the token
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decodedToken.userId;
    console.log("User ID:", userId);

    await connectToDatabase();
    const body = await req.json();
    const data = body.formData || body; // Ensure data structure

    const taskData = { ...data, createdBy: userId };
    console.log("Final Task Data:", taskData);

    // Create task with the userId from the token
    const res = await Task.create(taskData);
    if (res) {
      console.log("Task Created:", res);
      return NextResponse.json(
        { message: "Task Created Successfully!" },
        { status: 201 }
      );
    }
  } catch (error) {
    console.error("Error creating task:", error.message, error.stack);
    return NextResponse.json(
      { message: "Failed to create", error: error.message },
      { status: 500 }
    );
  }
}

export async function GET() {
  console.log("Handling GET request");
  try {
    await connectToDatabase();
    const task = await Task.find();
    return NextResponse.json({ task }, { status: 200 });
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return NextResponse.json(
      { message: "Failed to get task", error },
      { status: 500 }
    );
  }
}
