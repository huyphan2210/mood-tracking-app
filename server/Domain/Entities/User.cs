using Microsoft.AspNetCore.Identity;

namespace server.Domain.Entities
{
  public class User : IdentityUser
  {
    public string? FullName { get; set; }
  }
}
