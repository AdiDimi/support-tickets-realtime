import React from "react";
import { type Ticket } from "../generated/client";
import { TicketStatus, TicketPriority } from "../store/ui-store";
import { TicketRow } from "./TicketRow";

  tickets: Ticket[];
  onSetStatus: (id: string, status: TicketStatus) => Promise<void>;
  onSetPriority: (id: string, priority: TicketPriority) => Promise<void>;
}

export function TicketList({
  tickets,
  onSetStatus,
  onSetPriority,
}: TicketListProps) {
  return (
    <table width="100%" cellPadding={8} className="dashboard-table">
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
