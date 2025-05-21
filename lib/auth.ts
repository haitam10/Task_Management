import jwt from "jsonwebtoken"

export interface User {
  id: string
  username: string
  role: "admin" | "user"
}

const JWT_SECRET = process.env.JWT_SECRET || "votre_clé_secrète"

export async function getAuthUser(request: Request): Promise<User | null> {
  const authHeader = request.headers.get("Authorization")

  if (!authHeader?.startsWith("Bearer ")) {
    return null
  }

  const token = authHeader.split(" ")[1]

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload & User

    if (!decoded.id || !decoded.username || !decoded.role) {
      return null
    }

    return {
      id: decoded.id,
      username: decoded.username,
      role: decoded.role,
    }
  } catch (error) {
    console.error("Token invalide :", error)
    return null
  }
}
