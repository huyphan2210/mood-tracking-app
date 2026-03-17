using server.DTOs.User;

namespace server.Services.UserServices
{
  public interface IUserSevices
  {
    public Task UpdateUserAsync(Guid userId, UpdateUserRequestPATCH request);
  }
}