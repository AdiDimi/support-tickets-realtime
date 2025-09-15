namespace SupportTickets.Api.Dtos;

public record CreateTicketRequest(string Title, string? Description, string Priority);
public record UpdateTicketRequest(string? Title, string? Description, string? Status, string? Priority, Guid? AssigneeId);