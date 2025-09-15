import React, { useState } from "react";
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

export function Dashboard() {
  useTicketRealtime();

  const { data: tickets, isLoading } = useListTicketsQuery();
  const createMutation = useCreateTicketMutation();
  const updateMutation = useUpdateTicketMutation();

  // Filtering state
  const [filterStatus, setFilterStatus] = useState<string>("");
  const [filterPriority, setFilterPriority] = useState<string>("");

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

  // Filter tickets
  const filteredTickets = (tickets || []).filter((t: Ticket) => {
    const statusMatch = filterStatus ? t.status === filterStatus : true;
    const priorityMatch = filterPriority ? t.priority === filterPriority : true;
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
              setFilterStatus(e.target.value)
            }
            style={{ marginLeft: 8 }}
          >
            <option value="">All</option>
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
              setFilterPriority(e.target.value)
            }
            style={{ marginLeft: 8 }}
          >
            <option value="">All</option>
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
      {isLoading ? (
        <p>Loading…</p>
      ) : (
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
