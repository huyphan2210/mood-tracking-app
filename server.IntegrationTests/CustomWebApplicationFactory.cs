using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using server.Data;
using server.Domain.Entities;

namespace server.IntegrationTests
{
  public class CustomWebApplicationFactory : WebApplicationFactory<Program>
  {
    private readonly string _dbName = Guid.NewGuid().ToString();
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

        // Add InMemory database
        services.AddDbContext<AppDbContext>(options =>
        {
          options.UseInMemoryDatabase(_dbName);
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