// Pre-generated minimal client (handwritten). Replace by running `npm run generate:client` after the API is up.
import {
  useQuery,
  useMutation,
  UseQueryResult,
  UseMutationResult,
} from "@tanstack/react-query";
import axios from "axios";
import type { components } from "./types";

const base =
  (import.meta.env.VITE_API_BASE as string) || "http://localhost:8080";

export type Ticket = components["schemas"]["Ticket"];
export type CreateTicketRequest = components["schemas"]["CreateTicketRequest"];
export type UpdateTicketRequest = components["schemas"]["UpdateTicketRequest"];

const http = axios.create({ baseURL: base });

// Raw calls
export const listTickets = async (): Promise<Ticket[]> => {
  const { data } = await http.get("/api/tickets");
  return data.items as Ticket[];
};

export const createTicket = async (
  payload: CreateTicketRequest
): Promise<Ticket> => {
  const { data } = await http.post("/api/tickets", payload);
  return data as Ticket;
};

export const updateTicket = async (
  id: string,
  payload: UpdateTicketRequest
): Promise<void> => {
  await http.patch(`/api/tickets/${id}`, payload);
};

// Hooks
export const useListTicketsQuery = (): UseQueryResult<Ticket[], unknown> => {
  return useQuery({ queryKey: ["tickets"], queryFn: listTickets });
};

export const useCreateTicketMutation = (): UseMutationResult<
  Ticket,
  unknown,
  CreateTicketRequest
> => {
  return useMutation({
    mutationKey: ["createTicket"],
    mutationFn: createTicket,
  });
};

export const useUpdateTicketMutation = (): UseMutationResult<
  void,
  unknown,
  { id: string; payload: UpdateTicketRequest }
> => {
  return useMutation({
    mutationKey: ["updateTicket"],
    mutationFn: ({ id, payload }) => updateTicket(id, payload),
  });
};
