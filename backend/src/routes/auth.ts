import { Router } from "express"
import bcrypt from "bcryptjs"
import db from "../database/db"

const router = Router()

type UserRow = {
  id: number
  username: string
  password: string
}

router.post("/register", (req, res) => {
 const { username, password } = req.body || {}

  if (!username || !password) {
    return res.status(400).json({ message: "Usuario y contraseña son obligatorios" })
  }

  const existingUser = db
    .prepare("SELECT * FROM users WHERE username = ?")
    .get(username) as UserRow | undefined

  if (existingUser) {
    return res.status(400).json({ message: "El usuario ya existe" })
  }

  const hashedPassword = bcrypt.hashSync(password, 10)

  db.prepare("INSERT INTO users (username, password) VALUES (?, ?)")
    .run(username, hashedPassword)

  res.status(201).json({ message: "Usuario registrado correctamente" })
})

router.post("/login", (req, res) => {
  const { username, password } = req.body

  const user = db
    .prepare("SELECT * FROM users WHERE username = ?")
    .get(username) as UserRow | undefined

  if (!user) {
    return res.status(401).json({ message: "Credenciales incorrectas" })
  }

  const validPassword = bcrypt.compareSync(password, user.password)

  if (!validPassword) {
    return res.status(401).json({ message: "Credenciales incorrectas" })
  }

  res.json({
    message: "Inicio de sesión correcto",
    user: {
      id: user.id,
      username: user.username,
    },
  })
})

export default router