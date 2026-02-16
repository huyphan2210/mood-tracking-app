using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using server.Domain.Entities;

namespace server.Data
{
  public class AppDbContext(DbContextOptions<AppDbContext> options) : IdentityDbContext<User>(options)
  {
  }
}
