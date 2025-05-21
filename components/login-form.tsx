"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, CheckSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import toast from "react-hot-toast"
import { loginUser } from "@/lib/api"
import Link from "next/link"

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!username || !password) {
      toast.error("Please enter both username and password")
      return
    }

    setLoading(true)

    try {
      const data = await loginUser(username, password)

      // Store token and user info
      localStorage.setItem("token", data.user.token)
      localStorage.setItem("user", JSON.stringify(data.user))

      toast.success("Login successful")
      router.push("/tasks")
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Login failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md bg-white rounded-lg border border-zinc-200 p-6 shadow-sm">
      <div className="flex justify-center mb-6">
        <div className="flex items-center gap-2">
          <div className="bg-blue-500 rounded flex items-center justify-center w-5 h-5">
            <CheckSquare className="text-white w-4 h-4" />
          </div>
          <span className="text-lg font-medium">Taski</span>
        </div>
      </div>

      <div className="text-center mb-6">
        <h1 className="text-2xl font-semibold">Login</h1>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
            className="bg-zinc-50"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••"
              className="bg-zinc-50 pr-10"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
        </div>

        <Button type="submit" className="w-full bg-blue-500 hover:bg-blue-600" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </Button>

        <div className="text-center mt-4">
          <p className="text-sm text-zinc-500">
            Don't have an account?{" "}
            <Link href="/register" className="text-blue-500 hover:underline">
              Register
            </Link>
          </p>
        </div>
      </form>
    </div>
  )
}
