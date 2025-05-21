"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Toaster } from "react-hot-toast"
import TaskList from "@/components/task-list"
import DashboardHeader from "@/components/dashboard-header"
import { useAuth } from "@/hooks/use-auth"

export default function TasksPage() {
  const router = useRouter()
  const { user, loading, logout } = useAuth()

  useEffect(() => {
    if (!loading && !user) {
      router.push("/")
    }
  }, [user, loading, router])

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50">
        <div className="text-xl">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      <DashboardHeader user={user} onLogout={logout} />
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">
            Welcome, <span className="text-blue-500">{user.username}</span>.
          </h1>
          <p className="text-zinc-500 mt-1">
            {user.role === "admin" ? "Your team got tasks to do." : "You've got tasks to do."}
          </p>
        </div>

        <TaskList />
      </main>
      <Toaster position="top-right" />
    </div>
  )
}
