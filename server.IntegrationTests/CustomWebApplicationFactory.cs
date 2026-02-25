using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using server.Data;
using server.Domain.Entities;
using Testcontainers.PostgreSql;

namespace server.IntegrationTests
{
  public class CustomWebApplicationFactory : WebApplicationFactory<Program>
  {
    private readonly PostgreSqlContainer _postgres = new PostgreSqlBuilder("postgres:15")
        .WithDatabase("testdb")
        .WithUsername("postgres")
        .WithPassword("postgres")
        .Build();

    public override async ValueTask DisposeAsync()
    {
      await _postgres.DisposeAsync();

      await base.DisposeAsync();

      GC.SuppressFinalize(this);
    }

    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
      _postgres.StartAsync().GetAwaiter().GetResult();

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
      });
    }

    public async Task SeedAsync()
    {
      using var scope = Services.CreateScope();
      var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
      var userManager = scope.ServiceProvider.GetRequiredService<UserManager<User>>();

      await context.Database.EnsureCreatedAsync();

      var user = new User
      {
        Email = "seed@test.com",
        UserName = "seed@test.com"
      };

      await userManager.CreateAsync(user, "Password123!");
    }
  }
}