using server.Domain.Entities;

namespace server.Repositories.UserRepository
{
  public interface IUserRepository
  {
    Task<User?> GetUserByIdAsync(Guid userId, CancellationToken cancellationToken);
  }
}
