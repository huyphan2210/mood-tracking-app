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
    IStorageClient storageClient
  ) : IUserSevices
  {
    private readonly UserManager<User> _userManager = userManager;
    private readonly IAuthenticationServices _authenticationServices = authenticationServices;
    private readonly IStorageClient _storageClient = storageClient;

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
        user.AvatarURL = uploadImageResult.Url.ToString();
      }

      user.FullName = request.FullName;

      await _userManager.UpdateAsync(user);
    }
  }
}