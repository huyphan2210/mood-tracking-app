
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Moq;
using server.Domain.Entities;
using server.Domain.Enums.User;
using server.DTOs.Authentication;
using server.Exceptions;
using server.Services.AuthenticationServices;
using server.UnitTests.Utilities;

namespace server.UnitTests.Services
{
  public class AuthenticationServicesTests
  {
    private readonly Mock<UserManager<User>> _userManagerMock;
    private readonly Mock<IConfiguration> _configurationMock;
    private readonly Mock<ILogger<AuthenticationServices>> _loggerMock;
    private readonly AuthenticationServices _service;

    public AuthenticationServicesTests()
    {
      var store = new Mock<IUserStore<User>>();
      _userManagerMock = CreateUserManagerMock.CreateMockUserManager();

      _configurationMock = new Mock<IConfiguration>();
      _configurationMock
        .Setup(c => c["Jwt:Key"])
        .Returns("a9rvjpqodWmgvYX2T43Zk+Cgr2yEpEQweLM2aIVUxxooYY8KoL3p6CTiPbX2ISC7W3mHeG0nw+4ECL5O650Hqg==");

      _loggerMock = new Mock<ILogger<AuthenticationServices>>();

      _service = new AuthenticationServices(
          _userManagerMock.Object,
          _configurationMock.Object,
          _loggerMock.Object);
    }

    [Fact]
    public async Task SignUpAsync_ShouldReturnAuthenticationBaseResponsePOST_Succeed()
    {
      SignUpRequestPOST request = new()
      {
        Email = "newuser@yopmail.com",
        Password = "123456@NewPassword"
      };

      _userManagerMock.Setup(userManager => userManager.CreateAsync(It.IsAny<User>(), request.Password)).ReturnsAsync(IdentityResult.Success);

      var result = await _service.SignUpAsync(request);
      Assert.NotNull(result);
      Assert.IsType<AuthenticationBaseResponsePOST>(result);
      Assert.Equal(UserStatus.NoFullName, result.Status);
    }

    [Theory]
    [InlineData("1a@")]
    [InlineData("123456")]
    [InlineData("abcdef")]
    [InlineData("abcd1@")]
    [InlineData("ABCD1@")]
    public async Task SignUpAsync_ShouldThrowValidationError_WhenPasswordIsInvalid(string invalidPassword)
    {
      SignUpRequestPOST request = new()
      {
        Email = "newuser@yopmail.com",
        Password = invalidPassword
      };

      bool hasDigit = invalidPassword.Any(char.IsDigit);
      bool hasLower = invalidPassword.Any(char.IsLower);
      bool hasUpper = invalidPassword.Any(char.IsUpper);
      bool hasNonAlphanumeric = invalidPassword.Any(c => !char.IsLetterOrDigit(c));

      string identityErrorCode = "";
      if (invalidPassword.Length < 6)
      {
        identityErrorCode = IdentityErrorCode.PasswordTooShort.ToString();
      }
      else if (!hasDigit)
      {
        identityErrorCode = IdentityErrorCode.PasswordRequiresDigit.ToString();
      }
      else if (!hasLower)
      {
        identityErrorCode = IdentityErrorCode.PasswordRequiresLower.ToString();
      }
      else if (!hasUpper)
      {
        identityErrorCode = IdentityErrorCode.PasswordRequiresUpper.ToString();
      }
      else if (!hasNonAlphanumeric)
      {
        identityErrorCode = IdentityErrorCode.PasswordRequiresNonAlphanumeric.ToString();
      }


      IdentityError identityError = new()
      {
        Code = identityErrorCode,
        Description = ""
      };

      _userManagerMock.Setup(userManager => userManager.CreateAsync(It.IsAny<User>(), request.Password)).ReturnsAsync(IdentityResult.Failed(identityError));

      var result = await Assert.ThrowsAsync<ValidationException>(() =>
          _service.SignUpAsync(request));

      Assert.Equal(identityError.Code, result.ErrorCode);
    }

    [Fact]
    public async Task SignUpAsync_ShouldThrowValidationError_WhenUserIsExisted()
    {
      SignUpRequestPOST request = new()
      {
        Email = "newuser@yopmail.com",
        Password = "123456@NewPassword"
      };

      IdentityError identityError = new()
      {
        Code = IdentityErrorCode.DuplicateUserName.ToString(),
        Description = ""
      };

      _userManagerMock.Setup(userManager => userManager.CreateAsync(It.IsAny<User>(), request.Password)).ReturnsAsync(IdentityResult.Failed(identityError));

      var result = await Assert.ThrowsAsync<ValidationException>(() =>
          _service.SignUpAsync(request));

      Assert.Equal(identityError.Code, result.ErrorCode);
    }

    [Fact]
    public async Task SignUpAsync_ShouldThrowValidationError_WhenEmailIsInvalid()
    {
      SignUpRequestPOST request = new()
      {
        Email = "seed",
        Password = "123456@NewPassword"
      };

      var result = await Assert.ThrowsAsync<ValidationException>(() =>
          _service.SignUpAsync(request));

      Assert.Equal("Email is invalid", result.Message);
    }

    [Fact]
    public async Task SignUpAsync_ShouldThrowExceptionError_UnknownException()
    {
      SignUpRequestPOST request = new()
      {
        Email = "newuser@yopmail.com",
        Password = "123456@NewPassword"
      };

      IdentityError identityError = new()
      {
        Code = "Something happens",
        Description = "Unknown Exception"
      };

      _userManagerMock.Setup(userManager => userManager.CreateAsync(It.IsAny<User>(), request.Password)).ReturnsAsync(IdentityResult.Failed(identityError));

      var result = await Assert.ThrowsAsync<Exception>(() =>
          _service.SignUpAsync(request));

      Assert.Equal("Failed to create a new user", result.Message);
    }

    [Fact]
    public async Task LoginAsync_ShouldThrowExceptionError_NonExistingEmailFound()
    {
      LoginRequestPOST request = new()
      {
        Email = "nonexistuser@yopmail.com",
        Password = "123456@Password"
      };

      var result = await Assert.ThrowsAsync<UnauthorizedException>(() =>
          _service.LoginAsync(request));

      Assert.Equal(IdentityErrorCode.UserNotFound.ToString(), result.ErrorCode);
      Assert.Equal("Either the email or password is invalid", result.Message);
    }

    [Fact]
    public async Task LoginAsync_ShouldThrowExceptionError_UserIsSoftDeleted()
    {
      LoginRequestPOST request = new()
      {
        Email = "nonexistuser@yopmail.com",
        Password = "123456@Password"
      };

      _userManagerMock.Setup(userManager => userManager.FindByEmailAsync(request.Email)).ReturnsAsync(new User
      {
        IsDeleted = true
      });

      var result = await Assert.ThrowsAsync<UnauthorizedException>(() =>
          _service.LoginAsync(request));

      Assert.Equal(IdentityErrorCode.UserNotFound.ToString(), result.ErrorCode);
      Assert.Equal("Either the email or password is invalid", result.Message);
    }

    [Fact]
    public async Task LoginAsync_ShouldThrowExceptionError_PasswordDoesNotMatch()
    {
      LoginRequestPOST request = new()
      {
        Email = "existinguser@yopmail.com",
        Password = "123456@Password"
      };

      var user = new User();
      _userManagerMock.Setup(userManager => userManager.FindByEmailAsync(request.Email)).ReturnsAsync(user);
      _userManagerMock.Setup(userManager => userManager.CheckPasswordAsync(user, request.Password)).ReturnsAsync(false);

      var result = await Assert.ThrowsAsync<UnauthorizedException>(() =>
          _service.LoginAsync(request));

      Assert.Equal(IdentityErrorCode.UserNotFound.ToString(), result.ErrorCode);
      Assert.Equal("Either the email or password is invalid", result.Message);
    }

    [Fact]
    public async Task LoginAsync_ShouldReturnJWT_EmailAndPasswordAreValid()
    {
      LoginRequestPOST request = new()
      {
        Email = "existinguser@yopmail.com",
        Password = "123456@Password"
      };

      var user = new User
      {
        Email = request.Email,
        UserName = request.Email,
      };

      _userManagerMock.Setup(userManager => userManager.FindByEmailAsync(request.Email)).ReturnsAsync(user);
      _userManagerMock.Setup(userManager => userManager.CheckPasswordAsync(user, request.Password)).ReturnsAsync(true);

      var result = await _service.LoginAsync(request);

      Assert.NotNull(result.JWT);
      Assert.Equal(UserStatus.NoFullName, result.Status);
    }
  }
}