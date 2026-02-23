using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using server.Data;
using server.Domain.Entities;
using server.Exceptions;
using server.Repositories.UserRepository;
using server.Services.AuthenticationServices;

const string AllowSpecificOrigin = "AllowSpecificOrigin";

var builder = WebApplication.CreateBuilder(args);

AddDatabaseConnection(builder);
AddCustomRepositories(builder);
AddCustomServices(builder);
AddGlobalExceptionHanlder(builder);

builder.Services.AddControllers();

builder.Services.AddOpenApi();

builder.Services.AddCors(options =>
{
    options.AddPolicy(AllowSpecificOrigin, corsBuilder =>
    {
        corsBuilder.WithOrigins(Environment.GetEnvironmentVariable("CLIENT_URL") ?? "http://localhost:3000")
            .AllowAnyMethod()
            .AllowAnyHeader()
            .AllowCredentials();
    });
});

var app = builder.Build();


if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

await DbInitializer.MigrateAsync(app.Services);
await DbInitializer.InitializeAync(app.Services);

app.UseCors(AllowSpecificOrigin);

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.UseExceptionHandler();


app.Run();

static void AddCustomServices(WebApplicationBuilder builder)
{
    builder.Services.AddScoped<IAuthenticationServices, AuthenticationServices>();
}

static void AddCustomRepositories(WebApplicationBuilder builder)
{
    builder.Services.AddScoped<IUserRepository, UserRepository>();
}

static void AddGlobalExceptionHanlder(WebApplicationBuilder builder)
{
    builder.Services.AddProblemDetails();
    builder.Services.AddExceptionHandler<GlobalExceptionHandler>();
}

static void AddDatabaseConnection(IHostApplicationBuilder builder)
{
    var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

    if (!builder.Environment.IsDevelopment())
    {
        var databaseEnvUrl = Environment.GetEnvironmentVariable("DATABASE_URL");
        if (string.IsNullOrEmpty(databaseEnvUrl))
        {
            throw new Exception("--- Environment variable DATABASE_URL is empty");
        }
        var databaseUrl = new Uri(databaseEnvUrl);
        var userInfo = databaseUrl.UserInfo.Split(':');

        connectionString =
            $"Host={databaseUrl.Host};Port={databaseUrl.Port};Database={databaseUrl.AbsolutePath.TrimStart('/')};Username={userInfo[0]};Password={userInfo[1]};SSL Mode=Require;Trust Server Certificate=true;";
    }
    builder.Services
        .AddIdentity<User, IdentityRole>()
        .AddEntityFrameworkStores<AppDbContext>()
        .AddDefaultTokenProviders();

    builder.Services.AddDbContext<AppDbContext>(options =>
        options.UseNpgsql(connectionString));
}
