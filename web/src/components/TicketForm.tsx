import React, { useState } from "react";
import { type CreateTicketRequest } from "../generated/client";
import { TicketPriority } from "../store/ui-store";

interface TicketFormProps {
  onCreate: (payload: CreateTicketRequest) => Promise<void>;
  isPending: boolean;
}

export function TicketForm({ onCreate, isPending }: TicketFormProps) {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [priority, setPriority] = useState<TicketPriority>(
    TicketPriority.Medium
  );
  const [assigneeId, setAssigneeId] = useState<string>("");
  const [error, setError] = useState<string>("");

  // Mock agent list
  const agents = [
    { id: "1", name: "Alice" },
    { id: "2", name: "Bob" },
    { id: "3", name: "Charlie" },
  ];

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    if (!title.trim()) return;
    const payload: CreateTicketRequest = {
      title,
      description: desc,
      priority,
      assigneeId: assigneeId || undefined,
    };
    try {
      await onCreate(payload);
      setTitle("");
      setDesc("");
      setPriority(TicketPriority.Medium);
      setAssigneeId("");
    } catch (err: any) {
      setError(err?.message || "Failed to create ticket");
    }
  };

  return (
    <form
      onSubmit={submit}
      style={{ display: "grid", gap: 8, marginBottom: 24 }}
    >
      {error && <div style={{ color: "red", marginBottom: 8 }}>{error}</div>}
      <input
        placeholder="Title"
        value={title}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setTitle(e.target.value)
        }
      />
      <input
        placeholder="Description"
        value={desc}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setDesc(e.target.value)
        }
      />
      <select
        value={priority}
        onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
          setPriority(e.target.value as TicketPriority)
        }
      >
        <option value={TicketPriority.Low}>Low</option>
        <option value={TicketPriority.Medium}>Medium</option>
        <option value={TicketPriority.High}>High</option>
        <option value={TicketPriority.Critical}>Critical</option>
      </select>
      <select
        value={assigneeId}
        onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
          setAssigneeId(e.target.value)
        }
      >
        <option value="">Unassigned</option>
        {agents.map((agent) => (
          <option key={agent.id} value={agent.id}>
            {agent.name}
          </option>
        ))}
      </select>
      <button type="submit" disabled={isPending}>
        Create ticket
      </button>
    </form>
  );
}
