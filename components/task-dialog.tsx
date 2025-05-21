"use client"

import React, { useEffect, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { Task } from "@/lib/api"

interface TaskDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  task: Task | null
  onSave: (task: Omit<Task, "id">) => void
  isAdmin: boolean
  users: { id: string; username: string; role: string }[]
}

export default function TaskDialog({
  open,
  onOpenChange,
  task,
  onSave,
  isAdmin,
  users,
}: TaskDialogProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [assignedTo, setAssignedTo] = useState("")
  const [status, setStatus] = useState<"in_progress" | "done">("in_progress")

  useEffect(() => {
    if (task) {
      setTitle(task.title)
      setDescription(task.description)
      setAssignedTo(task.assignedTo)
      setStatus(task.status)
    } else {
      setTitle("")
      setDescription("")
      setAssignedTo(users.length > 0 ? users[0].username : "")
      setStatus("in_progress")
    }
  }, [task, open, users])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validation simple côté client
    if (!title.trim() || !description.trim() || (isAdmin && !assignedTo.trim())) {
      alert("Please fill all required fields: title, description, and assignedTo.")
      return
    }

    onSave({
      title,
      description,
      assignedTo,
      status,
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-[500px]"
        aria-describedby="dialog-description"
      >
        <p id="dialog-description" className="sr-only">
          {task ? "Edit an existing task" : "Create a new task"}
        </p>

        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{task ? "Edit Task" : "Create Task"}</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Task title</Label>
              <Input
                id="title"
                placeholder="What's in your mind?"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="bg-zinc-50"
                required
              />
            </div>

            {isAdmin && (
              <div className="grid gap-2">
                <Label htmlFor="assignTo">Assign to</Label>
                <Select
                  value={assignedTo}
                  onValueChange={setAssignedTo}
                  required
                >
                  <SelectTrigger id="assignTo" className="bg-zinc-50">
                    <SelectValue placeholder="Assign to" />
                  </SelectTrigger>
                  <SelectContent>
                    {users
                    .filter((user) => user.role === "user")
                    .map((user) => (
                      <SelectItem key={user.id} value={user.username}>
                       {user.username}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Add relevant details, blockers, or context for this task here."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="bg-zinc-50 min-h-[100px]"
                required
              />
            </div>

            {task && (
              <div className="grid gap-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={status}
                  onValueChange={(value: "in_progress" | "done") =>
                    setStatus(value)
                  }
                >
                  <SelectTrigger id="status" className="bg-zinc-50">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="done">Done</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="text-red-500"
            >
              Cancel
            </Button>
            <Button type="submit" className="bg-blue-500 hover:bg-blue-600">
              {task ? "Save" : "Add task"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
