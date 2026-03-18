using CloudinaryDotNet.Actions;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Moq;
using server.Clients.StorageClient;
using server.Domain.Entities;
using server.Domain.Enums.User;
using server.DTOs.User;
using server.Exceptions;
using server.Services.AuthenticationServices;
using server.Services.UserServices;
using server.UnitTests.Utilities;

namespace server.UnitTests.Services
{
  public class UserServicesTests
  {
    private readonly Mock<UserManager<User>> _userManagerMock = CreateUserManagerMock.CreateMockUserManager();
    private readonly Mock<IAuthenticationServices> _authenticationServicesMock = new();
    private readonly Mock<IStorageClient> _storageClientMock = new();
    private readonly UserServices _userServices;

    private static IFormFile CreateMockFormFile(string fileName, int sizeInKB)
    {
      var bytes = new byte[sizeInKB * 1024];

      var stream = new MemoryStream(bytes);

      IFormFile formFile = new FormFile(stream, 0, stream.Length, "AvatarImage", fileName)
      {
        Headers = new HeaderDictionary(),
      };

      return formFile;
    }

    public UserServicesTests()
    {
      _userServices = new(
        _userManagerMock.Object,
        _authenticationServicesMock.Object,
        _storageClientMock.Object
      );
    }

    [Fact]
    public async Task UpdateUserAsync_ShouldThrowNotFoundException_UserDoesNotExist()
    {
      var request = new UpdateUserRequestPATCH();

      _authenticationServicesMock.Setup(
        services => services.FindUserByIdAsync(It.IsAny<Guid>())
      ).ThrowsAsync(
        new NotFoundException(IdentityErrorCode.UserNotFound.ToString(), "No User is Found")
      );

      var result = await Assert.ThrowsAsync<NotFoundException>(async () => await _userServices.UpdateUserAsync(Guid.NewGuid(), request));
      Assert.Equal(IdentityErrorCode.UserNotFound.ToString(), result.ErrorCode);
      Assert.Equal("No User is Found", result.Message);
    }

    [Fact]
    public async Task UpdateUserAsync_ShouldThrowValidationExpcetion_FileIsNotImage()
    {
      var user = new User
      {
        FullName = "Test"
      };

      var request = new UpdateUserRequestPATCH
      {
        FullName = "New Name",
        AvatarImage = CreateMockFormFile("avatar.txt", 240)
      };

      _authenticationServicesMock.Setup(
        services => services.FindUserByIdAsync(It.IsAny<Guid>())
      ).ReturnsAsync(user);

      var result = await Assert.ThrowsAsync<ValidationException>(async () => await _userServices.UpdateUserAsync(Guid.NewGuid(), request));

      Assert.Equal("ImageIsInvalid", result.ErrorCode);
    }

    [Fact]
    public async Task UpdateUserAsync_ShouldThrowValidationExpcetion_FileIsLargerThan250KB()
    {
      var user = new User
      {
        FullName = "Test"
      };

      var request = new UpdateUserRequestPATCH
      {
        FullName = "New Name",
        AvatarImage = CreateMockFormFile("avatar.jpg", 260)
      };

      _authenticationServicesMock.Setup(
        services => services.FindUserByIdAsync(It.IsAny<Guid>())
      ).ReturnsAsync(user);

      var result = await Assert.ThrowsAsync<ValidationException>(async () => await _userServices.UpdateUserAsync(Guid.NewGuid(), request));

      Assert.Equal("ImageIsInvalid", result.ErrorCode);
    }

    [Fact]
    public async Task UpdateUserAsync_ShouldUpdateFullName_NoFileIsUploaded()
    {
      var user = new User
      {
        FullName = "Test"
      };

      var request = new UpdateUserRequestPATCH
      {
        FullName = "New Name"
      };

      _authenticationServicesMock.Setup(
        services => services.FindUserByIdAsync(It.IsAny<Guid>())
      ).ReturnsAsync(user);

      await _userServices.UpdateUserAsync(Guid.NewGuid(), request);

      Assert.Equal("New Name", user.FullName);
      Assert.Null(user.AvatarURL);
    }

    [Fact]
    public async Task UpdateUserAsync_ShouldUpdateFullNameAndImage_Succeed()
    {
      var user = new User
      {
        FullName = "Test"
      };

      var request = new UpdateUserRequestPATCH
      {
        FullName = "New Name",
        AvatarImage = CreateMockFormFile("avatar.jpg", 250)
      };

      _authenticationServicesMock.Setup(
        services => services.FindUserByIdAsync(It.IsAny<Guid>())
      ).ReturnsAsync(user);

      _storageClientMock.Setup(client => client.UploadImageAsync(request.AvatarImage)).ReturnsAsync(new ImageUploadResult
      {
        Url = new Uri("https://example.com/")
      });

      await _userServices.UpdateUserAsync(Guid.NewGuid(), request);

      Assert.Equal("New Name", user.FullName);
      Assert.Equal("https://example.com/", user.AvatarURL);
    }
  }
}