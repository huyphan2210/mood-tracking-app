using server.DTOs.User;

namespace server.Services.UserServices
{
  public interface IUserSevices
  {
    public Task<UserResponse> GetUserByIdAsync(Guid userId, CancellationToken cancellationToken);
    public Task<UpdateUserResponse> UpdateUserAsync(Guid userId, UpdateUserRequestPATCH request);
  }
}