import React from "react";
import { type Ticket } from "../generated/client";

interface TicketRowProps {
  ticket: Ticket;
  onSetStatus: (id: string, status: Ticket["status"]) => Promise<void>;
  onSetPriority: (id: string, priority: Ticket["priority"]) => Promise<void>;
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
            onSetPriority(ticket.id, e.target.value as Ticket["priority"])
          }
        >
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
          <option>Critical</option>
        </select>
      </td>
      <td align="center">{ticket.status}</td>
      <td align="center">{assignee ? assignee.name : "Unassigned"}</td>
      <td align="center" style={{ whiteSpace: "nowrap" }}>
        <button onClick={() => onSetStatus(ticket.id, "Open")}>Open</button>{" "}
        <button onClick={() => onSetStatus(ticket.id, "InProgress")}>
          In Progress
        </button>{" "}
        <button onClick={() => onSetStatus(ticket.id, "Resolved")}>
          Resolved
        </button>
      </td>
      <td align="right">{new Date(ticket.updatedAt).toLocaleString()}</td>
    </tr>
  );
}
