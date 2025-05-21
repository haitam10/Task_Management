import { NextResponse } from "next/server"
import { loginUser } from "@/lib/api"

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json()

    if (!username || !password) {
      return NextResponse.json({ error: "Username and password are required" }, { status: 400 })
    }

    const response = await loginUser(username, password)

    // Tu peux éventuellement vérifier que response contient un token, etc.

    return NextResponse.json(response)
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Login failed" },
      { status: 401 }
    )
  }
}
