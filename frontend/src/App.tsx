import { useEffect, useState } from "react"
import type { FormEvent } from "react"
import {
  createTask,
  deleteTask,
  getTasks,
  loginUser,
  updateTask,
} from "./services/taskService"
import type { Task } from "./types/Task"
import "./App.css"

type FilterType = "all" | "pending" | "completed"

function App() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editTitle, setEditTitle] = useState("")
  const [editDescription, setEditDescription] = useState("")
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState<FilterType>("all")

  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [loginError, setLoginError] = useState("")
  const [loggedUser, setLoggedUser] = useState("")
  const [loggedUserId, setLoggedUserId] = useState<number | null>(null)

  const completedTasks = tasks.filter((task) => task.completed).length
  const pendingTasks = tasks.length - completedTasks

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(search.toLowerCase()) ||
      (task.description || "").toLowerCase().includes(search.toLowerCase())

    if (filter === "pending") return matchesSearch && !task.completed
    if (filter === "completed") return matchesSearch && task.completed
    return matchesSearch
  })

  const loadTasks = async (userId?: number) => {
      const currentUserId = userId || loggedUserId

      if (!currentUserId) return

      const response = await getTasks(currentUserId)
      setTasks(response.data)
    }

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!username.trim() || !password.trim()) {
      setLoginError("Ingresa usuario y contraseña")
      return
    }

    try {
      const response = await loginUser({
        username,
        password,
      })

      setLoggedUser(response.data.user.username)
      setLoggedUserId(response.data.user.id)
      setIsLoggedIn(true)
      setLoginError("")
      setUsername("")
      setPassword("")
      await loadTasks(response.data.user.id)
    } catch (error) {
      console.error(error)
      setLoginError("Usuario o contraseña incorrectos")
    }
  }

  const handleCreate = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!title.trim()) {
      alert("El título es obligatorio")
      return
    }

    if (!loggedUserId) {
      alert("No hay usuario iniciado")
      return
    }

    await createTask({
      title,
      description,
      userId: loggedUserId,
    })

    setTitle("")
    setDescription("")
    await loadTasks(loggedUserId)
  }

  const handleToggle = async (task: Task) => {
    if (!loggedUserId) return

    await updateTask(task.id, {
      completed: !task.completed,
      userId: loggedUserId,
    })
    await loadTasks()
  }

  const handleDelete = async (id: number) => {
    const confirmDelete = window.confirm("¿Seguro que deseas eliminar esta tarea?")
    if (!confirmDelete) return

    if (!loggedUserId) return
    await deleteTask(id, loggedUserId)
    await loadTasks()
  }

  const startEdit = (task: Task) => {
    setEditingId(task.id)
    setEditTitle(task.title)
    setEditDescription(task.description || "")
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditTitle("")
    setEditDescription("")
  }

  const handleUpdate = async (id: number) => {
    if (!editTitle.trim()) {
      alert("El título no puede quedar vacío")
      return
    }

    if (!loggedUserId) return

      await updateTask(id, {
        title: editTitle,
        description: editDescription,
        userId: loggedUserId,
      })

    cancelEdit()
    await loadTasks()
  }

useEffect(() => {
    if (loggedUserId) {
      void loadTasks(loggedUserId)
    }
  }, [loggedUserId])


  if (!isLoggedIn) {
    return (
      <main className="app">
        <section className="login-page">
          <div className="login-card">
            <span className="badge">FULL STACK ASSESSMENT</span>

            <h1>Hyrule Board</h1>

            <p>Inicia sesión para administrar tus tareas.</p>

            <form onSubmit={handleLogin} className="login-form">
              <input
                type="text"
                placeholder="Usuario"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />

              <input
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              {loginError && (
                <span className="login-error">{loginError}</span>
              )}

              <button type="submit" className="primary-btn">
                Iniciar sesión
              </button>
            </form>
          </div>
        </section>
      </main>
    )
  }

  return (
    <main className="app">
      <section className="workspace">
        <header className="hero">
          <div>
            <span className="badge">FULL STACK ASSESSMENT</span>
            <h1>Hyrule Board</h1>
            <p>
              Bienvenida, {loggedUser}. Sistema de gestión de tareas.
            </p>

            <button
              type="button"
              className="logout-btn"
              onClick={() => {
              setIsLoggedIn(false)
              setLoggedUser("")
              setLoggedUserId(null)
              setTasks([])
            }}
            >
              Cerrar sesión
            </button>
          </div>

          <div className="stats">
            <div className="stat-card">
              <span>Total</span>
              <strong>{tasks.length}</strong>
            </div>

            <div className="stat-card">
              <span>Completadas</span>
              <strong>{completedTasks}</strong>
            </div>

            <div className="stat-card">
              <span>Pendientes</span>
              <strong>{pendingTasks}</strong>
            </div>
          </div>
        </header>

        <section className="controls">
          <input
            type="text"
            placeholder="Buscar tarea por título o descripción..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <div className="filters">
            <button
              className={filter === "all" ? "active" : ""}
              onClick={() => setFilter("all")}
              type="button"
            >
              Todas
            </button>

            <button
              className={filter === "pending" ? "active" : ""}
              onClick={() => setFilter("pending")}
              type="button"
            >
              Pendientes
            </button>

            <button
              className={filter === "completed" ? "active" : ""}
              onClick={() => setFilter("completed")}
              type="button"
            >
              Completadas
            </button>
          </div>
        </section>

        <section className="grid">
          <form className="create-card" onSubmit={handleCreate}>
            <span>NUEVA ACTIVIDAD</span>
            <h2>Registrar tarea</h2>
            <p>Agrega una tarea con título obligatorio y descripción opcional.</p>

            <input
              type="text"
              placeholder="Título de la tarea"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <textarea
              placeholder="Descripción opcional"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <button type="submit" className="primary-btn">
              Agregar
            </button>
          </form>

          <section className="tasks-card">
            <div className="tasks-header">
              <div>
                <h2>Lista de tareas</h2>
                <p>Resultados mostrados: {filteredTasks.length}</p>
              </div>
            </div>

            <div className="tasks-list">
              {filteredTasks.length === 0 ? (
                <p className="empty">
                  No se encontraron tareas con los criterios seleccionados.
                </p>
              ) : (
                filteredTasks.map((task) => (
                  <article className="task" key={task.id}>
                    {editingId === task.id ? (
                      <div className="edit-box">
                        <input
                          type="text"
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                        />

                        <textarea
                          value={editDescription}
                          onChange={(e) => setEditDescription(e.target.value)}
                        />

                        <div className="actions">
                          <button
                            type="button"
                            className="save-btn"
                            onClick={() => handleUpdate(task.id)}
                          >
                            Guardar
                          </button>

                          <button
                            type="button"
                            className="cancel-btn"
                            onClick={cancelEdit}
                          >
                            Cancelar
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="task-top">
                          <div>
                            <h3 className={task.completed ? "done" : ""}>
                              {task.title}
                            </h3>

                            <p>{task.description || "Sin descripción"}</p>
                          </div>

                          <span
                            className={
                              task.completed
                                ? "status done-status"
                                : "status pending-status"
                            }
                          >
                            {task.completed ? "Completada" : "Pendiente"}
                          </span>
                        </div>

                        <div className="task-footer">
                          <small>
                            Creada:{" "}
                            {task.created_at
                              ? new Date(task.created_at).toLocaleString()
                              : "Sin fecha"}
                          </small>

                          <div className="actions">
                            <button
                              type="button"
                              className="edit-btn"
                              onClick={() => startEdit(task)}
                            >
                              Editar
                            </button>

                            <button
                              type="button"
                              className="complete-btn"
                              onClick={() => handleToggle(task)}
                            >
                              {task.completed ? "↺ Pendiente" : "✓ Completar"}
                            </button>

                            <button
                              type="button"
                              className="delete-btn"
                              onClick={() => handleDelete(task.id)}
                            >
                              Eliminar
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                  </article>
                ))
              )}
            </div>
          </section>
        </section>
      </section>
    </main>
  )
}

export default App