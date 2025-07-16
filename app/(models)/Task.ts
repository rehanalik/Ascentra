import mongoose, { Schema } from "mongoose";

const taskSchema = new Schema(
  {
    title: String,
    description: String,
    status: String,
    progress: Number,
    priority: Number,
    department: String,
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    dueDate: Date, // This is correct
    // active: Boolean,
  },
  {
    timestamps: true,
  }
);

// Check if the model is already defined to prevent OverwriteModelError
const Task = mongoose.models.Task || mongoose.model("Task", taskSchema);

export default Task;
