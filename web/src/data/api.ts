import axios from 'axios'

const base = import.meta.env.VITE_API_BASE || 'http://localhost:8080'

export const api = axios.create({
  baseURL: base,
})

export type Ticket = {
  id: string
  title: string
  description: string
  status: 'Open' | 'InProgress' | 'Resolved'
  priority: 'Low' | 'Medium' | 'High' | 'Critical'
  assigneeId?: string | null
  createdAt: string
  updatedAt: string
}

export async function listTickets(): Promise<Ticket[]> {
  const { data } = await api.get('/api/tickets')
  return data.items
}

export async function createTicket(payload: { title: string; description?: string; priority: Ticket['priority'] }) {
  const { data } = await api.post('/api/tickets', payload)
  return data as Ticket
}

export async function updateTicket(id: string, payload: Partial<Pick<Ticket, 'title'|'description'|'status'|'priority'>> & { assigneeId?: string | null }) {
  await api.patch(`/api/tickets/${id}`, payload)
}