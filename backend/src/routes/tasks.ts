import { Router } from "express"
import db from "../database/db"

const router = Router()

type TaskRow = {
  id: number
  user_id: number
  title: string
  description: string
  completed: number
  created_at: string
  updated_at: string
}

router.get("/", (req, res) => {
  const userId = Number(req.query.userId)

  if (!userId) {
    return res.status(400).json({ message: "userId es requerido" })
  }

  const tasks = db
    .prepare("SELECT * FROM tasks WHERE user_id = ? ORDER BY id DESC")
    .all(userId) as TaskRow[]

  const formattedTasks = tasks.map((task) => ({
    ...task,
    completed: Boolean(task.completed),
  }))

  res.json(formattedTasks)
})

router.post("/", (req, res) => {
  const { title, description, userId } = req.body

  if (!userId) {
    return res.status(400).json({ message: "userId es requerido" })
  }

  if (!title) {
    return res.status(400).json({ message: "El título es obligatorio" })
  }

  const result = db
    .prepare("INSERT INTO tasks (user_id, title, description) VALUES (?, ?, ?)")
    .run(userId, title, description || "")

  const task = db
    .prepare("SELECT * FROM tasks WHERE id = ?")
    .get(result.lastInsertRowid) as TaskRow

  res.status(201).json({
    ...task,
    completed: Boolean(task.completed),
  })
})

router.put("/:id", (req, res) => {
  const { id } = req.params
  const { title, description, completed, userId } = req.body

  if (!userId) {
    return res.status(400).json({ message: "userId es requerido" })
  }

  const task = db
    .prepare("SELECT * FROM tasks WHERE id = ? AND user_id = ?")
    .get(id, userId) as TaskRow | undefined

  if (!task) {
    return res.status(404).json({ message: "Tarea no encontrada" })
  }

  const updatedTitle = title ?? task.title
  const updatedDescription = description ?? task.description
  const updatedCompleted =
    completed !== undefined ? Number(completed) : task.completed

  db.prepare(`
    UPDATE tasks
    SET title = ?, description = ?, completed = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ? AND user_id = ?
  `).run(updatedTitle, updatedDescription, updatedCompleted, id, userId)

  const updatedTask = db
    .prepare("SELECT * FROM tasks WHERE id = ? AND user_id = ?")
    .get(id, userId) as TaskRow

  res.json({
    ...updatedTask,
    completed: Boolean(updatedTask.completed),
  })
})

router.delete("/:id", (req, res) => {
  const { id } = req.params
  const userId = Number(req.query.userId)

  if (!userId) {
    return res.status(400).json({ message: "userId es requerido" })
  }

  const task = db
    .prepare("SELECT * FROM tasks WHERE id = ? AND user_id = ?")
    .get(id, userId) as TaskRow | undefined

  if (!task) {
    return res.status(404).json({ message: "Tarea no encontrada" })
  }

  db.prepare("DELETE FROM tasks WHERE id = ? AND user_id = ?").run(id, userId)

  res.json({ message: "Tarea eliminada correctamente" })
})

export default router