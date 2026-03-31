namespace server.DTOs.User
{
  public class UserResponse
  {
    public required string FullName { get; set; }
    public required string Email { get; set; }
    public string? AvatarURL { get; set; }
  }
}