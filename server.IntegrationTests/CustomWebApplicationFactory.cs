using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using server.Data;
using server.Domain.Entities;
using Testcontainers.PostgreSql;
using Respawn;
using Npgsql;
using Microsoft.AspNetCore.Authentication;

namespace server.IntegrationTests
{
  public class CustomWebApplicationFactory : WebApplicationFactory<Program>
  {
    private readonly PostgreSqlContainer _postgres = new PostgreSqlBuilder("postgres:15")
      .WithDatabase("testdb")
      .WithUsername("postgres")
      .WithPassword("postgres")
      .Build();

    private Respawner? _respawner;

    public async Task InitializeAsync()
    {
      await _postgres.StartAsync();

      using var scope = Services.CreateScope();
      var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
      await context.Database.MigrateAsync();

      await using var connection = new NpgsqlConnection(_postgres.GetConnectionString());
      await connection.OpenAsync();

      _respawner = await Respawner.CreateAsync(connection, new RespawnerOptions
      {
        DbAdapter = DbAdapter.Postgres,
        TablesToIgnore = ["__EFMigrationsHistory"]
      });
    }

    public override async ValueTask DisposeAsync()
    {
      await _postgres.DisposeAsync();

      await base.DisposeAsync();

      GC.SuppressFinalize(this);
    }

    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
      builder.UseEnvironment("Testing");
      builder.ConfigureServices(services =>
      {
        var dbContextDescriptor = services
               .SingleOrDefault(d =>
                   d.ServiceType == typeof(DbContextOptions<AppDbContext>));

        if (dbContextDescriptor != null)
          services.Remove(dbContextDescriptor);

        services.AddDbContext<AppDbContext>(options =>
        {
          options.UseNpgsql(_postgres.GetConnectionString());
        });

        services.AddAuthentication(options =>
        {
          options.DefaultAuthenticateScheme = TestAuthHandler.Scheme;
          options.DefaultChallengeScheme = TestAuthHandler.Scheme;
        })
        .AddScheme<AuthenticationSchemeOptions, TestAuthHandler>(
          TestAuthHandler.Scheme,
          options => { });
      });
    }

    public async Task ResetDatabaseAsync()
    {
      await using var connection = new NpgsqlConnection(_postgres.GetConnectionString());
      await connection.OpenAsync();

      await _respawner!.ResetAsync(connection);
    }

    public async Task SeedUserAsync(User? user = null)
    {
      using var scope = Services.CreateScope();
      var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
      var userManager = scope.ServiceProvider.GetRequiredService<UserManager<User>>();

      var newUser = user ?? SeedData.DefaultSeedUser;

      await userManager.CreateAsync(newUser, "Password123!");
    }
  }
}