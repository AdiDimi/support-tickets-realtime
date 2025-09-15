using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using SupportTickets.Api.Data;
using SupportTickets.Api.Hubs;

namespace SupportTickets.Api.Workers;

public sealed class OutboxWorker(ILogger<OutboxWorker> log, IHubContext<TicketsHub> hub, AppDb db)
    : BackgroundService
{
    protected override async Task ExecuteAsync(CancellationToken ct)
    {
        while (!ct.IsCancellationRequested)
        {
            var events = await db.OutboxEvents
                .Where(e => e.ProcessedAt == null)
                .OrderBy(e => e.OccurredAt)
                .Take(100)
                .ToListAsync(ct);

            foreach (var e in events)
            {
                try
                {
                    await hub.Clients.All.SendAsync(e.Type, e.Payload, ct);
                    e.ProcessedAt = DateTime.UtcNow;
                }
                catch (Exception ex)
                {
                    log.LogError(ex, "Failed to publish outbox event {Id}", e.Id);
                }
            }

            if (events.Count > 0)
                await db.SaveChangesAsync(ct);

            await Task.Delay(500, ct);
        }
    }
}