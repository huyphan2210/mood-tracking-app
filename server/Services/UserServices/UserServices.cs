using Microsoft.AspNetCore.Identity;
using server.Clients.StorageClient;
using server.Domain.Entities;
using server.DTOs.User;
using server.Exceptions;
using server.Services.AuthenticationServices;

namespace server.Services.UserServices
{
  public class UserServices(
    UserManager<User> userManager,
    IAuthenticationServices authenticationServices,
    IStorageClient storageClient,
    ILogger<IUserSevices> logger
  ) : IUserSevices
  {
    private readonly UserManager<User> _userManager = userManager;
    private readonly IAuthenticationServices _authenticationServices = authenticationServices;
    private readonly IStorageClient _storageClient = storageClient;
    private readonly ILogger<IUserSevices> _logger = logger;

    public async Task UpdateUserAsync(Guid userId, UpdateUserRequestPATCH request)
    {
      var user = await _authenticationServices.FindUserByIdAsync(userId);
      if (request.AvatarImage is not null)
      {
        const long maxImageSize = 250 * 1024;
        string[] allowedExtensions = [".jpg", ".jpeg", ".png"];
        string extension = Path.GetExtension(request.AvatarImage.FileName).ToLowerInvariant();

        if (request.AvatarImage.Length > maxImageSize || !allowedExtensions.Contains(extension))
        {
          throw new ValidationException("ImageIsInvalid", "Unsupported file type or size. Please upload a PNG or JPEG with the maximum of 250KB");
        }

        var uploadImageResult = await _storageClient.UploadImageAsync(request.AvatarImage);
        if (uploadImageResult.Error is not null)
        {
          _logger.LogError($"Failed to upload image of user {userId} to Cloudinary: {uploadImageResult.Error.Message}");
          throw new Exception($"Failed to upload image of user {userId} to Cloudinary: {uploadImageResult.Error.Message}");
        }

        user.AvatarURL = uploadImageResult.Url.ToString();
      }

      user.FullName = request.FullName;

      await _userManager.UpdateAsync(user);
    }
  }
}