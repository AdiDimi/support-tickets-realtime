import React from "react";
import { type Ticket } from "../generated/client";
import { TicketStatus, TicketPriority } from "../store/ui-store";

  ticket: Ticket;
  onSetStatus: (id: string, status: TicketStatus) => Promise<void>;
  onSetPriority: (id: string, priority: TicketPriority) => Promise<void>;
}

export function TicketRow({
  ticket,
  onSetStatus,
  onSetPriority,
}: TicketRowProps) {
  // Mock agent list
  const agents = [
    { id: "1", name: "Alice" },
    { id: "2", name: "Bob" },
    { id: "3", name: "Charlie" },
  ];
  const assignee = agents.find((a) => a.id === ticket.assigneeId);

  return (
    <tr style={{ borderTop: "1px solid #ddd" }}>
      <td>{ticket.title}</td>
      <td>{ticket.description}</td>
      <td align="center">
        <select
          value={ticket.priority}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
            onSetPriority(ticket.id, e.target.value as TicketPriority)
          }
        >
          <option value={TicketPriority.Low}>Low</option>
          <option value={TicketPriority.Medium}>Medium</option>
          <option value={TicketPriority.High}>High</option>
          <option value={TicketPriority.Critical}>Critical</option>
        </select>
      </td>
      <td align="center">{ticket.status}</td>
      <td align="center">{assignee ? assignee.name : "Unassigned"}</td>
      <td align="center" style={{ whiteSpace: "nowrap" }}>
        <button onClick={() => onSetStatus(ticket.id, TicketStatus.Open)}>Open</button>{" "}
        <button onClick={() => onSetStatus(ticket.id, TicketStatus.InProgress)}>
          In Progress
        </button>{" "}
        <button onClick={() => onSetStatus(ticket.id, TicketStatus.Resolved)}>
          Resolved
        </button>
      </td>
      <td align="right">{new Date(ticket.updatedAt).toLocaleString()}</td>
    </tr>
  );
}
