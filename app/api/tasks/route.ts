import { NextResponse } from "next/server"
import { getAuthUser } from "@/lib/auth"

// Mock tasks - in a real app, this would be in a database
const tasks = [
  {
    id: "01",
    title: "Task 01",
    description: "Note: Add relevant details, blockers, or context for this task here.",
    assignedTo: "user1",
    status: "in progress",
  },
  {
    id: "02",
    title: "Task 02",
    description: "Note: Add relevant details, blockers, or context for this task here.",
    assignedTo: "user2",
    status: "in progress",
  },
  {
    id: "03",
    title: "Task 03",
    description: "Note: Add relevant details, blockers, or context for this task here.",
    assignedTo: "user3",
    status: "in progress",
  },
]

export async function GET(request: Request) {
  try {
    const user = await getAuthUser(request)

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Filter tasks based on user role
    const filteredTasks = user.role === "admin" ? tasks : tasks.filter((task) => task.assignedTo === user.id)

    return NextResponse.json(filteredTasks)
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const user = await getAuthUser(request)

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Only admin can create tasks
    if (user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const taskData = await request.json()

    // Validate required fields
    if (!taskData.title || !taskData.assignedTo) {
      return NextResponse.json({ error: "Title and assignedTo are required" }, { status: 422 })
    }

    const newTask = {
      id: String(tasks.length + 1).padStart(2, "0"),
      title: taskData.title,
      description: taskData.description || "",
      assignedTo: taskData.assignedTo,
      status: taskData.status || "in progress",
    }

    tasks.push(newTask)

    return NextResponse.json(newTask, { status: 201 })
  } catch (error) {
    console.error("POST /api/tasks error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
