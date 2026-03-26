using Microsoft.AspNetCore.Identity;
using server.Clients.StorageClient;
using server.Domain.Entities;
using server.Domain.Enums.User;
using server.DTOs.User;
using server.Exceptions;
using server.Services.AuthenticationServices;
using server.Repositories.UserRepository;

namespace server.Services.UserServices
{
  public class UserServices(
    UserManager<User> userManager,
    IAuthenticationServices authenticationServices,
    IUserRepository userRepository,
    IStorageClient storageClient,
    ILogger<IUserSevices> logger
  ) : IUserSevices
  {
    private readonly UserManager<User> _userManager = userManager;
    private readonly IAuthenticationServices _authenticationServices = authenticationServices;
    private readonly IUserRepository _userRepository = userRepository;
    private readonly IStorageClient _storageClient = storageClient;
    private readonly ILogger<IUserSevices> _logger = logger;

    public async Task<UserResponse> GetUserByIdAsync(Guid userId, CancellationToken cancellationToken)
    {
      var user = await _userRepository.GetUserByIdAsync(userId, cancellationToken)
        ?? throw new NotFoundException(IdentityErrorCode.UserNotFound.ToString(), $"Cannot find a user with id ${userId}");

      return new()
      {
        FullName = user.FullName!,
        Email = user.Email!,
        AvatarURL = user.AvatarURL
      };
    }

    public async Task<UpdateUserResponse> UpdateUserAsync(Guid userId, UpdateUserRequestPATCH request)
    {
      var user = await _userRepository.GetUserByIdAsync(userId, default)
        ?? throw new NotFoundException(IdentityErrorCode.UserNotFound.ToString(), $"Cannot find a user with id ${userId}");

      if (request.AvatarImage is not null)
      {
        var uploadImageResult = await _storageClient.UploadImageAsync(request.AvatarImage);
        if (uploadImageResult.Error is not null)
        {
          _logger.LogError($"Failed to upload image of user {userId} to Cloudinary: {uploadImageResult.Error.Message}");
          throw new Exception($"Failed to upload image of user {userId} to Cloudinary: {uploadImageResult.Error.Message}");
        }

        user.AvatarURL = uploadImageResult.SecureUrl.ToString();
      }

      if (request.FullName is not null)
      {
        user.FullName = request.FullName;
      }

      await _userManager.UpdateAsync(user);

      return new UpdateUserResponse
      {
        JWT = _authenticationServices.GenerateJwtToken(user),
        Status = user.FullName is null ? UserStatus.NoFullName : UserStatus.Active
      };
    }
  }
}