"use client"

import Link from "next/link"
import { CheckSquare } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import type { User } from "@/lib/api"

interface DashboardHeaderProps {
  user: User
  onLogout: () => void
}

export default function DashboardHeader({ user, onLogout }: DashboardHeaderProps) {
  return (
    <header className="border-b border-zinc-100 py-4 bg-white">
      <div className="container mx-auto px-4 max-w-6xl flex justify-between items-center">
        <Link href="/tasks" className="flex items-center gap-2">
          <div className="bg-blue-500 rounded flex items-center justify-center w-6 h-6">
            <CheckSquare className="text-white w-4 h-4" />
          </div>
          <span className="text-lg font-medium">Taski</span>
        </Link>

        <div className="flex items-center gap-2">
          <span className="text-zinc-700">{user.username}</span>
          <Button variant="ghost" size="icon" onClick={onLogout} className="rounded-full">
            <Avatar className="h-10 w-10 border border-zinc-200">
              <AvatarFallback className={user.role === "admin" ? "bg-purple-500 text-white" : "bg-zinc-200"}>
                {user.username.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </Button>
        </div>
      </div>
    </header>
  )
}
