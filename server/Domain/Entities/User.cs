using Microsoft.AspNetCore.Identity;

namespace server.Domain.Entities
{
  public class User : IdentityUser<Guid>
  {
    public string? FullName { get; set; }
    public string? AvatarURL { get; set; }
    public DateTime CreatedAt { get; protected set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; protected set; }
    public Boolean IsDeleted { get; set; }
  }
}
