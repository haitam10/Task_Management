"use client"

import { useEffect, useState } from "react"
import { CheckCircle, Pencil, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import TaskDialog from "@/components/task-dialog"
import { useAuth } from "@/hooks/use-auth"
import toast from "react-hot-toast"
import { getTasks, deleteTask, updateTask, createTask, getUsers } from "@/lib/api"
import type { Task } from "@/lib/api"

export default function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [users, setUsers] = useState<{ id: string; username: string }[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [currentTask, setCurrentTask] = useState<Task | null>(null)
  const { user } = useAuth()

  const fetchTasks = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem("token")

      if (!token) {
        throw new Error("No authentication token found")
      }

      const data = await getTasks(token)
      setTasks(data)
    } catch (error) {
      toast.error("Failed to load tasks")
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token")

      if (!token || user?.role !== "admin") {
        return
      }

      const data = await getUsers(token)
      setUsers(data)
    } catch (error) {
      console.error("Failed to load users:", error)
    }
  }

  useEffect(() => {
    if (user) {
      fetchTasks()
      fetchUsers()
    }
  }, [user])

  const handleCreateTask = () => {
    setCurrentTask(null)
    setIsDialogOpen(true)
  }

  const handleEditTask = (task: Task) => {
    setCurrentTask(task)
    setIsDialogOpen(true)
  }

  const handleDeleteTask = async (taskId: string) => {
    try {
      const token = localStorage.getItem("token")

      if (!token) {
        throw new Error("No authentication token found")
      }

      await deleteTask(taskId, token)
      setTasks(tasks.filter((task) => task.id !== taskId))
      toast.success("Task deleted successfully")
    } catch (error) {
      toast.error("Failed to delete task")
      console.error(error)
    }
  }

  const handleToggleStatus = async (task: Task) => {
    try {
      const token = localStorage.getItem("token")

      if (!token) {
        throw new Error("No authentication token found")
      }

      const newStatus = task.status === "in_progress" ? "done" : "in_progress"

      const updatedTask = await updateTask(task.id, { status: newStatus }, token)

      setTasks(tasks.map((t) => (t.id === task.id ? updatedTask : t)))
      toast.success(`Task marked as ${newStatus === "in_progress" ? "in progress" : "done"}`)
    } catch (error) {
      toast.error("Failed to update task status")
      console.error(error)
    }
  }

  const handleSaveTask = async (taskData: Omit<Task, "id">) => {
    try {
      const token = localStorage.getItem("token")

      if (!token) {
        toast.error("Authentication token missing. Please log in again.")
        return
      }

      if (currentTask) {
        // Update existing task
        const updatedTask = await updateTask(currentTask.id, taskData, token)
        setTasks(tasks.map((task) => (task.id === currentTask.id ? updatedTask : task)))
        toast.success("Task updated successfully")
      } else {
        // Create new task
        const newTask = await createTask(taskData, token)
        setTasks([...tasks, newTask])
        toast.success("Task created successfully")
      }

      setIsDialogOpen(false)
    } catch (error) {
      console.error("Save task error:", error)
      toast.error(error instanceof Error ? error.message : "Operation failed")
    }
  }

  if (loading) {
    return <div className="text-center py-8">Loading tasks...</div>
  }

  return (
    <div className="space-y-4">
      {tasks.length === 0 ? (
        <div className="text-center py-8 text-zinc-500">
          No tasks found. {user?.role === "admin" && "Create a new task to get started."}
        </div>
      ) : (
        tasks.map((task) => (
          <div
            key={task.id}
            className={`bg-white rounded-lg p-4 border border-zinc-100 shadow-sm ${
              task.status === "done" ? "bg-zinc-50" : ""
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className="mt-1">
                  {task.status === "done" ? (
                    <CheckCircle className="h-5 w-5 text-blue-500" />
                  ) : (
                    <div className="h-5 w-5 border-2 border-zinc-300 rounded-full" />
                  )}
                </div>
                <div>
                  <h3 className={`font-medium text-lg ${task.status === "done" ? "line-through text-zinc-500" : ""}`}>
                    {task.title}
                  </h3>
                  <p className="text-zinc-500 mt-1">{task.description}</p>
                  {user?.role === "admin" && (
                    <div className="text-blue-400 text-sm mt-2">
                      Assigned to: {users.find((u) => u.id === task.assignedTo)?.username || task.assignedTo}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {(user?.role === "admin" || user?.role === "user") && (
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-9 w-9 rounded-full"
                    onClick={() => handleEditTask(task)}
                  >
                    <Pencil className="h-4 w-4" />
                    <span className="sr-only">Edit task</span>
                  </Button>
                )}

                {user?.role === "admin" && (
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-9 w-9 rounded-full text-red-500 hover:text-red-600"
                    onClick={() => handleDeleteTask(task.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Delete task</span>
                  </Button>
                )}

                {(user?.role === "admin" || user?.role === "user") && (
                  <Button
                    onClick={() => handleToggleStatus(task)}
                    className={`${
                      task.status === "done"
                        ? "bg-zinc-200 hover:bg-zinc-300 text-zinc-700"
                        : "bg-blue-500 hover:bg-blue-600 text-white"
                    } rounded-full px-4 h-9`}
                  >
                    <CheckCircle className="h-5 w-5 mr-1" />
                    {task.status === "done" ? "Undo" : "Done"}
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))
      )}

      {user?.role === "admin" && (
        <Button variant="outline" className="flex items-center gap-2 text-zinc-500" onClick={handleCreateTask}>
          <Plus className="h-4 w-4" />
          Add a new task...
        </Button>
      )}

      <TaskDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        task={currentTask}
        onSave={handleSaveTask}
        isAdmin={user?.role === "admin"}
        users={users}
      />
    </div>
  )
}
