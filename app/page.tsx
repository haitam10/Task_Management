"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import LoginForm from "@/components/login-form"

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem("token")
    if (token) {
      router.push("/tasks")
    }
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 p-4">
      <LoginForm />
    </div>
  )
}
