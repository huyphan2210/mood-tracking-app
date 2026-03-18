using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Moq;
using server.Domain.Entities;

namespace server.UnitTests.Utilities
{
  public class CreateUserManagerMock
  {
    public static Mock<UserManager<User>> CreateMockUserManager()
    {
      var store = new Mock<IUserStore<User>>();
      var options = new Mock<IOptions<IdentityOptions>>();
      var passwordHasher = new Mock<IPasswordHasher<User>>();
      var userValidators = new List<IUserValidator<User>>();
      var passwordValidators = new List<IPasswordValidator<User>>();
      var keyNormalizer = new Mock<ILookupNormalizer>();
      var errors = new IdentityErrorDescriber();
      var services = new Mock<IServiceProvider>();
      var logger = new Mock<ILogger<UserManager<User>>>();

      return new Mock<UserManager<User>>(
        store.Object,
        options.Object,
        passwordHasher.Object,
        userValidators,
        passwordValidators,
        keyNormalizer.Object,
        errors,
        services.Object,
        logger.Object
      );
    }
  }
}