import { NextResponse } from "next/server";
import User from "../../(models)/User";
import { connectToDatabase } from "../../lib/mongoose";

export async function GET() {
  try {
    await connectToDatabase();
    const users = await User.find({}, "email");
    return NextResponse.json({ users }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "failed to fetch users", error });
  }
}
