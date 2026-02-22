using Microsoft.AspNetCore.Identity;

namespace server.Domain.Entities
{
  public class User : IdentityUser
  {
    public string? FullName { get; protected set; }
    public DateTime CreatedAt { get; protected set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; protected set; }
    public Boolean IsDeleted { get; set; }
  }
}
