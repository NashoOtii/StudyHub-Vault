using Microsoft.EntityFrameworkCore;
using StudyHub.Data;
using StudyHub.Services;

var builder = WebApplication.CreateBuilder(args);

// 1. DATABASE CONFIGURATION
builder.Services.AddDbContext<StudyHubDbContext>(options =>
    options.UseSqlite("Data Source=StudyHub.db"));

// 2. REGISTER CONTROLLERS & SWAGGER
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// 3. REGISTER SERVICES (Business Logic)
builder.Services.AddScoped<MaterialService>();
builder.Services.AddScoped<UserService>();

// 4. CONFIGURE CORS (Allows React to talk to C#)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp",
        policy => policy.AllowAnyOrigin()
                        .AllowAnyMethod()
                        .AllowAnyHeader());
});

var app = builder.Build();

// 5. AUTO-CREATE DATABASE & TABLES
// This fixes the "no such table: Users" error by building them on startup
using (var scope = app.Services.CreateScope()) 
{
    var db = scope.ServiceProvider.GetRequiredService<StudyHubDbContext>();
    db.Database.EnsureCreated(); 
}

// 6. CONFIGURE HTTP REQUEST PIPELINE
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// UseCors MUST come before MapControllers
app.UseCors("AllowReactApp");

app.MapControllers();

app.Run();