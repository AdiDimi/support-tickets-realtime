using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SupportTickets.Api.Data;
using SupportTickets.Api.Dtos;
using SupportTickets.Api.Models;

namespace SupportTickets.Api.Controllers;

/// <summary>CRUD for support tickets and outbox emission for real-time.</summary>
[ApiController]
[Route("api/[controller]")]
public class TicketsController(AppDb db) : ControllerBase
{
    /// <summary>List tickets with optional filtering.</summary>
    [HttpGet]
    public async Task<ActionResult<object>> List([FromQuery] string? status, [FromQuery] string? priority)
    {
        var q = db.Tickets.AsQueryable();
        if (Enum.TryParse<TicketStatus>(status, true, out var s)) q = q.Where(x => x.Status == s);
        if (Enum.TryParse<TicketPriority>(priority, true, out var p)) q = q.Where(x => x.Priority == p);

        var items = await q.OrderByDescending(x => x.UpdatedAt).Take(200).ToListAsync();
        return Ok(new { items });
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<Ticket>> Get(Guid id)
    {
        var t = await db.Tickets.FindAsync(id);
        return t is null ? NotFound() : Ok(t);
    }

    [HttpPost]
    public async Task<ActionResult<Ticket>> Create([FromBody] CreateTicketRequest req)
    {
        if (!Enum.TryParse<TicketPriority>(req.Priority, true, out var prio))
            return BadRequest(new { message = "Invalid priority" });

        var t = new Ticket
        {
            Title = req.Title,
            Description = req.Description ?? "",
            Priority = prio,
            Status = TicketStatus.Open,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        db.Tickets.Add(t);
        db.OutboxEvents.Add(OutboxEvent.For("ticketCreated", new { id = t.Id, title = t.Title, priority = t.Priority.ToString() }));
        await db.SaveChangesAsync();
        return CreatedAtAction(nameof(Get), new { id = t.Id }, t);
    }

    [HttpPatch("{id:guid}")]
    public async Task<ActionResult> Update(Guid id, [FromBody] UpdateTicketRequest req)
    {
        var t = await db.Tickets.FindAsync(id);
        if (t is null) return NotFound();

        if (req.Title != null) t.Title = req.Title;
        if (req.Description != null) t.Description = req.Description;
        if (req.Status != null && Enum.TryParse<TicketStatus>(req.Status, true, out var s)) t.Status = s;
        if (req.Priority != null && Enum.TryParse<TicketPriority>(req.Priority, true, out var p)) t.Priority = p;
        if (req.AssigneeId.HasValue) t.AssigneeId = req.AssigneeId;
        t.UpdatedAt = DateTime.UtcNow;

        db.OutboxEvents.Add(OutboxEvent.For("ticketUpdated", new { id = t.Id, status = t.Status.ToString(), priority = t.Priority.ToString() }));
        await db.SaveChangesAsync();
        return NoContent();
    }
}