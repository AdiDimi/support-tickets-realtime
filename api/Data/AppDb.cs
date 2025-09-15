using Microsoft.EntityFrameworkCore;
using SupportTickets.Api.Models;

namespace SupportTickets.Api.Data;

public class AppDb(DbContextOptions<AppDb> options) : DbContext(options)
{
    public DbSet<Ticket> Tickets => Set<Ticket>();
    public DbSet<OutboxEvent> OutboxEvents => Set<OutboxEvent>();

    protected override void OnModelCreating(ModelBuilder b)
    {
        b.Entity<Ticket>(e =>
        {
            e.HasKey(x => x.Id);
            e.Property(x => x.Title).HasMaxLength(200).IsRequired();
            e.Property(x => x.Status).HasConversion<string>();
            e.Property(x => x.Priority).HasConversion<string>();
            e.HasIndex(x => new { x.Status, x.Priority, x.UpdatedAt });
        });

        b.Entity<OutboxEvent>(e =>
        {
            e.HasKey(x => x.Id);
            e.HasIndex(x => x.ProcessedAt);
        });
    }
}