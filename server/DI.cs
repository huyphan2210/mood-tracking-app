using Google.GenAI;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
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
using server.Services.UserServices;
using CloudinaryDotNet;
using server.Clients.StorageClient;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Mvc;
using server.DTOs.Exception;

namespace server
{
  public static class DI
  {
    public const string TEST_ENV = "Testing";
    public const string ALLOW_SPECIFIC_ORIGIN = "AllowSpecificOrigin";

    public static void InjectDependencies(WebApplicationBuilder builder)
    {
      AddDatabaseConnection(builder);
      AddCustomRepositories(builder);
      AddCustomBackgroundServices(builder);
      AddCustomServices(builder);
      AddCustomClient(builder);
      AddGlobalExceptionHanlder(builder);
      AddAuthentication(builder);

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

      builder.Services.Configure<ApiBehaviorOptions>(options =>
      {
        options.InvalidModelStateResponseFactory = context =>
        {
          var errorMessage = string.Join("; ",
            context.ModelState.Values
              .SelectMany(v => v.Errors)
              .Select(e => e.ErrorMessage)
          );

          var error = new ErrorResponse
          {
            ErrorCode = "VALIDATION_ERROR",
            Message = errorMessage ?? "Invalid request."
          };

          return new BadRequestObjectResult(error);
        };
      });
    }

    static void AddCustomServices(WebApplicationBuilder builder)
    {
      builder.Services.AddScoped<IAuthenticationServices, AuthenticationServices>();
      builder.Services.AddScoped<IUserSevices, UserServices>();
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

      builder.Services.AddSingleton(sp =>
      {
        var configuration = sp.GetRequiredService<IConfiguration>();
        var apiKey = configuration["Cloudinary:URL"];
        return new Cloudinary(apiKey);
      });

      builder.Services.AddSingleton<IStorageClient, StorageClient>();
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

    static void AddAuthentication(WebApplicationBuilder builder)
    {
      builder.Services
        .AddAuthentication(options =>
        {
          options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
          options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
          options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
        })
        .AddJwtBearer(options =>
        {
          options.TokenValidationParameters = new TokenValidationParameters
          {
            ValidateIssuerSigningKey = true,
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = false,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],

            IssuerSigningKey = new SymmetricSecurityKey(
              Convert.FromBase64String(builder.Configuration["Jwt:Key"])
            )
          };

          options.Events = new JwtBearerEvents
          {
            OnAuthenticationFailed = context =>
            {
              Console.WriteLine($"Authentication failed: {context.Exception}");
              return Task.CompletedTask;
            },

            OnChallenge = context =>
            {
              Console.WriteLine($"OnChallenge error: {context.Error}");
              Console.WriteLine($"Description: {context.ErrorDescription}");
              return Task.CompletedTask;
            },

            OnTokenValidated = context =>
            {
              Console.WriteLine("Token validated successfully");
              return Task.CompletedTask;
            }
          };
        });
    }
  }
}