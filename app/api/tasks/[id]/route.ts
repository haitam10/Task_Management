import { NextResponse } from "next/server"
import { getAuthUser } from "@/lib/auth"

// Mock tasks - in a real app, this would be in a database
// This is a reference to the same array in the main tasks route
// In a real app, you would use a database
let tasks = [
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

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const user = await getAuthUser(request)

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const taskId = params.id
    const taskIndex = tasks.findIndex((t) => t.id === taskId)

    if (taskIndex === -1) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 })
    }

    const task = tasks[taskIndex]

    // Check permissions: admin can edit any task, users can only edit their own tasks
    if (user.role !== "admin" && task.assignedTo !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    let updates
    try {
      updates = await request.json()
    } catch (e) {
      console.error("Failed to parse request body:", e)
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
    }

    // Admin can update any field, users can only update status
    if (user.role === "admin") {
      tasks[taskIndex] = {
        ...task,
        ...updates,
        // Preserve the ID
        id: task.id,
      }
    } else {
      // Regular users can only update status
      if (updates.status) {
        tasks[taskIndex] = {
          ...task,
          status: updates.status,
        }
      }
    }

    return NextResponse.json(tasks[taskIndex])
  } catch (error) {
    console.error("PUT /api/tasks/[id] error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const user = await getAuthUser(request)

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Only admin can delete tasks
    if (user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const taskId = params.id
    const taskIndex = tasks.findIndex((t) => t.id === taskId)

    if (taskIndex === -1) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 })
    }

    const deletedTask = tasks[taskIndex]
    tasks = tasks.filter((t) => t.id !== taskId)

    return NextResponse.json(deletedTask)
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
