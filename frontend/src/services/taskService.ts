import axios from "axios"

const API_URL = import.meta.env.VITE_API_URL

const TASKS_API = `${API_URL}/tasks`
const AUTH_API = `${API_URL}/auth`

type TaskData = {
  title?: string
  description?: string
  completed?: boolean
  userId?: number
}

type LoginData = {
  username: string
  password: string
}

export const getTasks = (userId: number) =>
  axios.get(`${TASKS_API}?userId=${userId}`)

export const createTask = (task: TaskData) =>
  axios.post(TASKS_API, task)

export const updateTask = (id: number, task: TaskData) =>
  axios.put(`${TASKS_API}/${id}`, task)

export const deleteTask = (id: number, userId: number) =>
  axios.delete(`${TASKS_API}/${id}?userId=${userId}`)

export const loginUser = (data: LoginData) =>
  axios.post(`${AUTH_API}/login`, data)

export const registerUser = (data: LoginData) =>
  axios.post(`${AUTH_API}/register`, data)