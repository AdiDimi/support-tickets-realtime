// Minimal pre-generated types. Regenerate via `npm run generate:types`.
export interface components {
  schemas: {
    Ticket: {
      id: string;
      title: string;
      description: string;
      status: "Open" | "InProgress" | "Resolved";
      priority: "Low" | "Medium" | "High" | "Critical";
      assigneeId?: string | null;
      createdAt: string;
      updatedAt: string;
    };
    CreateTicketRequest: {
      title: string;
      description?: string | null;
      priority: "Low" | "Medium" | "High" | "Critical";
    };
    UpdateTicketRequest: Partial<
      Pick<
        components["schemas"]["Ticket"],
        "title" | "description" | "status" | "priority"
      >
    > & { assigneeId?: string | null };
  };
}
