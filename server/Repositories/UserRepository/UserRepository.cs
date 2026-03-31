using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using server.Domain.Entities;

namespace server.Repositories.UserRepository
{
  public class UserRepository(UserManager<User> userManager) : IUserRepository
  {
    private readonly UserManager<User> _userManager = userManager;

    public async Task<User?> GetUserByIdAsync(Guid userId, CancellationToken cancellationToken = default)
    {
      var user = await _userManager.Users.FirstOrDefaultAsync(user => user.Id == userId && user.IsDeleted == false, cancellationToken);
      return user;
    }
  }
}