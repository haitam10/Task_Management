"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"
import type { User } from "@/lib/api"

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check if user is logged in
    try {
      const storedUser = localStorage.getItem("user")
      const token = localStorage.getItem("token")

      if (storedUser && token) {
        try {
          const parsedUser = JSON.parse(storedUser)
          setUser(parsedUser)
        } catch (error) {
          console.error("Failed to parse user data", error)
          localStorage.removeItem("user")
          localStorage.removeItem("token")
        }
      }
    } catch (error) {
      console.error("Error accessing localStorage:", error)
    } finally {
      setLoading(false)
    }
  }, [])

  const logout = () => {
    try {
      localStorage.removeItem("token")
      localStorage.removeItem("user")
    } catch (error) {
      console.error("Error clearing localStorage:", error)
    }

    setUser(null)
    toast.success("Logged out successfully")
    router.push("/")
  }

  return { user, loading, logout }
}
