import React from "react";
import { useTicketRealtime } from "../hooks/useTicketRealtime";
import {
  useListTicketsQuery,
  useCreateTicketMutation,
  useUpdateTicketMutation,
  type Ticket,
  type CreateTicketRequest,
} from "../generated/client";
import { queryClient } from "../data/queryClient";
import { TicketForm } from "./TicketForm";
import { TicketList } from "./TicketList";
import "../styles/dashboard.css";
import { useUIDispatch, useUISelector } from "../store/ui-store";

export function Dashboard() {
  useTicketRealtime();

  const {
    data: tickets,
    isLoading,
    isError,
    error,
    refetch,
  } = useListTicketsQuery();
  const createMutation = useCreateTicketMutation();
  const updateMutation = useUpdateTicketMutation();

  // Filtering state from UI store
  const dispatch = useUIDispatch();
  const filterStatus = useUISelector((s) => s.filters.status);
  const filterPriority = useUISelector((s) => s.filters.priority);

  const handleCreate = async (payload: CreateTicketRequest) => {
    await createMutation.mutateAsync(payload);
    queryClient.invalidateQueries({ queryKey: ["tickets"] });
  };

  const handleSetStatus = async (id: string, status: Ticket["status"]) => {
    await updateMutation.mutateAsync({ id, payload: { status } });
    queryClient.invalidateQueries({ queryKey: ["tickets"] });
  };

  const handleSetPriority = async (
    id: string,
    priority: Ticket["priority"]
  ) => {
    await updateMutation.mutateAsync({ id, payload: { priority } });
    queryClient.invalidateQueries({ queryKey: ["tickets"] });
  };

  // Filter tickets ("All" disables the filter)
  const filteredTickets = (tickets || []).filter((t: Ticket) => {
    const statusMatch =
      filterStatus === "All" ? true : t.status === filterStatus;
    const priorityMatch =
      filterPriority === "All" ? true : t.priority === filterPriority;
    return statusMatch && priorityMatch;
  });

  return (
    <div className="dashboard-container">
      <h1>Support Tickets</h1>
      {/* Filtering Controls */}
      <div className="dashboard-controls">
        <label>
          Status:
          <select
            value={filterStatus}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              dispatch({ type: "setStatus", payload: e.target.value as any })
            }
            style={{ marginLeft: 8 }}
          >
            <option value="All">All</option>
            <option value="Open">Open</option>
            <option value="InProgress">In Progress</option>
            <option value="Resolved">Resolved</option>
          </select>
        </label>
        <label>
          Priority:
          <select
            value={filterPriority}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              dispatch({ type: "setPriority", payload: e.target.value as any })
            }
            style={{ marginLeft: 8 }}
          >
            <option value="All">All</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
            <option value="Critical">Critical</option>
          </select>
        </label>
      </div>
      <TicketForm
        onCreate={handleCreate}
        isPending={createMutation.isPending}
      />
      {isLoading && <p>Loading…</p>}
      {isError && (
        <div style={{ color: "red" }}>
          Failed to load tickets.{" "}
          <button onClick={() => refetch()}>Retry</button>
        </div>
      )}
      {!isLoading && !isError && filteredTickets.length === 0 && (
        <p>No tickets found. Create a new ticket to get started.</p>
      )}
      {!isLoading && !isError && filteredTickets.length > 0 && (
        <div style={{ overflowX: "auto" }}>
          <TicketList
            tickets={filteredTickets}
            onSetStatus={handleSetStatus}
            onSetPriority={handleSetPriority}
          />
        </div>
      )}
    </div>
  );
}
