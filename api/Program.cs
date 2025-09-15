using Microsoft.EntityFrameworkCore;
using Serilog;
using SupportTickets.Api.Data;
using SupportTickets.Api.Hubs;
using SupportTickets.Api.Workers;

var builder = WebApplication.CreateBuilder(args);

// Serilog
builder.Host.UseSerilog((ctx, cfg) => cfg
    .ReadFrom.Configuration(ctx.Configuration)
    .Enrich.FromLogContext());

// EF Core
var cs = builder.Configuration.GetConnectionString("Default")!;
builder.Services.AddDbContext<AppDb>(o => o.UseSqlServer(cs));

// SignalR + Redis backplane
var redis = builder.Configuration.GetSection("Redis").GetValue<string>("Connection") ?? "localhost:6379";
builder.Services.AddSignalR().AddStackExchangeRedis(redis);

// Controllers, Swagger
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// CORS (dev)
builder.Services.AddCors(o => o.AddDefaultPolicy(policy =>
    policy.AllowAnyHeader().AllowAnyMethod().AllowCredentials().WithOrigins(
        builder.Configuration["AllowedOrigin"] ?? "http://localhost:5173")));

// Outbox worker
builder.Services.AddHostedService<OutboxWorker>();

var app = builder.Build();

// Create schema and seed
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDb>();
    db.Database.EnsureCreated();

    // Simple seed
    if (!db.Tickets.Any())
    {
        db.Tickets.AddRange(
            new Models.Ticket { Title = "Payment failed at checkout", Description = "Customer cannot complete payment", Priority = Models.TicketPriority.High },
            new Models.Ticket { Title = "Login issue", Description = "User reports password reset loop", Priority = Models.TicketPriority.Medium },
            new Models.Ticket { Title = "Feature request: Dark mode", Description = "Customer asks for dark theme", Priority = Models.TicketPriority.Low }
        );
        db.SaveChanges();
    }
}

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseSerilogRequestLogging();
app.UseCors();
app.MapControllers();
app.MapHub<TicketsHub>("/hubs/tickets");
app.MapGet("/health", () => Results.Ok(new { status = "ok" }));

app.Run();