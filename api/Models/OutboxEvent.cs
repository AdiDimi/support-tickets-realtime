namespace SupportTickets.Api.Models;

public class OutboxEvent
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Type { get; set; } = string.Empty; // e.g., ticketCreated
    public string Payload { get; set; } = string.Empty; // JSON
    public DateTime OccurredAt { get; set; } = DateTime.UtcNow;
    public DateTime? ProcessedAt { get; set; }

    public static OutboxEvent For(string type, object payload) => new()
    {
        Type = type,
        Payload = System.Text.Json.JsonSerializer.Serialize(payload)
    };
}