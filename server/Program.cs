using System.IdentityModel.Tokens.Jwt;
using System.Text;
using System.Text.Json.Serialization;
using Google.GenAI;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using server.Background.Queue;
using server.Clients.GenAIClient;

using server.Background.Workers;
using server.Data;
using server.Domain.Entities;
using server.Exceptions;
using server.Repositories.MoodRepository;
using server.Repositories.UserRepository;
using server.Services.AuthenticationServices;
using server.Services.LLMServices;
using server.Services.MoodServices;

const string TEST_ENV = "Testing";
const string ALLOW_SPECIFIC_ORIGIN = "AllowSpecificOrigin";

var builder = WebApplication.CreateBuilder(args);

AddDatabaseConnection(builder);

AddCustomRepositories(builder);
AddCustomBackgroundServices(builder);
AddCustomServices(builder);
AddCustomClient(builder);
AddGlobalExceptionHanlder(builder);

builder.Services.AddControllers().AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.Converters.Add(
            new JsonStringEnumConverter()
        );
    });

builder.Services.AddOpenApi();

builder.Services.ConfigureHttpJsonOptions(options =>
{
    options.SerializerOptions.Converters
        .Add(new JsonStringEnumConverter());
});

builder.Services.AddCors(options =>
{
    options.AddPolicy(ALLOW_SPECIFIC_ORIGIN, corsBuilder =>
    {
        corsBuilder.WithOrigins(builder.Configuration["Cors:ClientUrl"] ?? "")
            .AllowAnyMethod()
            .AllowAnyHeader()
            .AllowCredentials();
    });
});

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        IssuerSigningKey = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"])
        )
    };
});

JwtSecurityTokenHandler.DefaultInboundClaimTypeMap.Clear();

var port = Environment.GetEnvironmentVariable("PORT") ?? "8080";
builder.WebHost.UseUrls($"http://0.0.0.0:{port}");

var app = builder.Build();


if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

if (!app.Environment.IsEnvironment(TEST_ENV))
{
    await DbInitializer.MigrateAsync(app.Services);
    await DbInitializer.InitializeAync(app.Services);
}

app.UseCors(ALLOW_SPECIFIC_ORIGIN);

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.UseExceptionHandler();

app.Run();

static void AddCustomServices(WebApplicationBuilder builder)
{
    builder.Services.AddScoped<IAuthenticationServices, AuthenticationServices>();
    builder.Services.AddScoped<ILLMServices, LLMServices>();
    builder.Services.AddScoped<IMoodServices, MoodServices>();
}

static void AddCustomBackgroundServices(WebApplicationBuilder builder)
{
    builder.Services.AddSingleton<IBackgroundTaskQueue, BackgroundTaskQueue>();
    builder.Services.AddSingleton(typeof(IBackgroundTaskQueue<>), typeof(BackgroundTaskQueue<>));

    builder.Services.AddHostedService<MoodAnalysisWorker>();
}

static void AddCustomClient(WebApplicationBuilder builder)
{
    builder.Services.AddSingleton(sp =>
    {
        var configuration = sp.GetRequiredService<IConfiguration>();
        var apiKey = configuration["Gemini:Apikey"];
        return new Client(apiKey: apiKey);
    });

    builder.Services.AddSingleton<IGenAIClient, GenAIClient>();
}

static void AddCustomRepositories(WebApplicationBuilder builder)
{
    builder.Services.AddScoped<IUserRepository, UserRepository>();
    builder.Services.AddScoped<IMoodRepository, MoodRepository>();
}

static void AddGlobalExceptionHanlder(WebApplicationBuilder builder)
{
    builder.Services.AddProblemDetails();
    builder.Services.AddExceptionHandler<GlobalExceptionHandler>();
}

static void AddDatabaseConnection(IHostApplicationBuilder builder)
{
    var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

    if (!builder.Environment.IsDevelopment() && !builder.Environment.IsEnvironment(TEST_ENV))
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

    if (!builder.Environment.IsEnvironment(TEST_ENV))
    {
        builder.Services.AddDbContext<AppDbContext>(options =>
            options.UseNpgsql(connectionString));
    }

    builder.Services
        .AddIdentity<User, IdentityRole<Guid>>()
        .AddEntityFrameworkStores<AppDbContext>()
        .AddDefaultTokenProviders();
}
