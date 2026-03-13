using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using server.Domain.Entities;

namespace server.Data
{
  public static class DbInitializer
  {
    public static async Task MigrateAsync(IServiceProvider serviceProvider)
    {
      using var scope = serviceProvider.CreateScope();
      var services = scope.ServiceProvider;
      var db = services.GetRequiredService<AppDbContext>();

      await db.Database.MigrateAsync();
    }

    public static async Task InitializeAync(IServiceProvider serviceProvider)
    {
      using var scope = serviceProvider.CreateScope();
      var userManager = scope.ServiceProvider.GetRequiredService<UserManager<User>>();

      var guest = await userManager.FindByNameAsync("guest@example.com");

      if (guest == null)
      {
        var user = new User
        {
          Id = Guid.Parse("019cd5ad-2246-765d-8d3b-27610e81c6ca"),
          UserName = "guest@example.com",
          Email = "guest@example.com",
          EmailConfirmed = true,
          FullName = "Guest User"
        };

        await userManager.CreateAsync(user, "Guest123!");
      }
    }
  }
}