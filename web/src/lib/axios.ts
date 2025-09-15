import axios from 'axios'

const base = (import.meta.env.VITE_API_BASE as string) || 'http://localhost:8080'

export const axiosClient = (config: any) => {
  const instance = axios.create({ baseURL: base })
  return instance(config)
}