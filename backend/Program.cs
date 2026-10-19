// Program.cs
var builder = WebApplication.CreateBuilder(args);

// ✅ Step 1: Register CORS policy
// Read origins from config
var allowedOrigins = builder.Configuration
    .GetSection("AllowedOrigins")
    .Get<string[]>() ?? Array.Empty<string>();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngularApp", policy =>
    {
        policy
            .WithOrigins(allowedOrigins)  // 👈 from appsettings
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});


builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// ✅ Step 2: Apply CORS middleware
// ⚠️ Order matters: UseCors MUST come before UseAuthorization
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowAngularApp");   // 👈 BEFORE UseAuthorization
app.UseAuthorization();
app.MapControllers();

app.Run();
