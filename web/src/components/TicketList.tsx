import React from "react";
import { type Ticket } from "../generated/client";
import { TicketRow } from "./TicketRow";

interface TicketListProps {
  tickets: Ticket[];
  onSetStatus: (id: string, status: Ticket["status"]) => Promise<void>;
  onSetPriority: (id: string, priority: Ticket["priority"]) => Promise<void>;
}

export function TicketList({
  tickets,
  onSetStatus,
  onSetPriority,
}: TicketListProps) {
  return (
    <table width="100%" cellPadding={8} style={{ borderCollapse: "collapse" }}>
      <thead>
        <tr>
          <th align="left">Title</th>
          <th>Description</th>
          <th>Priority</th>
          <th>Status</th>
          <th>Assignee</th>
          <th>Actions</th>
          <th>Updated</th>
        </tr>
      </thead>
      <tbody>
        {tickets.map((ticket) => (
          <TicketRow
            key={ticket.id}
            ticket={ticket}
            onSetStatus={onSetStatus}
            onSetPriority={onSetPriority}
          />
        ))}
      </tbody>
    </table>
  );
}
