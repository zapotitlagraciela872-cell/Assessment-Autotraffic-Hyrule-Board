import express from "express"
import cors from "cors"

import taskRoutes from "./routes/tasks"
import authRoutes from "./routes/auth"

const app = express()

app.use(cors())
app.use(express.json())

app.use("/tasks", taskRoutes)
app.use("/auth", authRoutes)


app.listen(3000, () => {
  console.log("Servidor iniciado")
})