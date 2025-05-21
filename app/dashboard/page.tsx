import TaskList from "@/components/task-list"
import DashboardHeader from "@/components/dashboard-header"

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-zinc-50">
      <DashboardHeader />
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">
            Welcome, <span className="text-blue-500">Admin</span>.
          </h1>
          <p className="text-zinc-500 mt-1">Your team got 3 tasks to do.</p>
        </div>

        <TaskList />
      </main>
    </div>
  )
}
