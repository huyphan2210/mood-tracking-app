using server.DTOs.User;

namespace server.Services.UserServices
{
  public interface IUserSevices
  {
    public Task<UpdateUserResponse> UpdateUserAsync(Guid userId, UpdateUserRequestPATCH request);
  }
}