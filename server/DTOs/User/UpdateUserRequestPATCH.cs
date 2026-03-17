namespace server.DTOs.User
{
  public class UpdateUserRequestPATCH
  {
    public string? FullName { get; set; }
    public IFormFile? AvatarImage { get; set; }
  }
}