## API Usage (summary)

Base URL: `${VITE_API_BASE}` (default `http://localhost:8080`)

### List Tickets

GET `/api/tickets`
Response:

```json
{
  "items": [
    {
      "id": "1",
      "title": "...",
      "description": "...",
      "status": "Open",
      "priority": "Medium",
      "assigneeId": "2",
      "createdAt": "2025-01-01T12:00:00Z",
      "updatedAt": "2025-01-01T12:00:00Z"
    }
  ]
}
```

### Create Ticket

POST `/api/tickets`
Body:

```json
{
  "title": "Issue",
  "description": "Text",
  "priority": "High",
  "assigneeId": "2"
}
```

Response: `Ticket`

### Update Ticket

PATCH `/api/tickets/{id}`
Body (any subset):

```json
{ "status": "Resolved", "priority": "Critical", "assigneeId": null }
```

Response: 204 No Content

### Realtime (SignalR)

Hub: `/hubs/tickets`
Events emitted by server:

- `ticketCreated`
- `ticketUpdated`
