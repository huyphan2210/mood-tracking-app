using CloudinaryDotNet;
using CloudinaryDotNet.Actions;

namespace server.Clients.StorageClient
{
  public class StorageClient(Cloudinary cloudinary) : IStorageClient
  {
    private readonly Cloudinary _cloudinary = cloudinary;

    public async Task<ImageUploadResult> UploadImageAsync(IFormFile file)
    {
      using var stream = file.OpenReadStream();

      var uploadParams = new ImageUploadParams
      {
        File = new FileDescription(file.FileName, stream),
        Folder = "mood-tracking-app",
        UseFilename = true,
        UniqueFilename = true,
        Overwrite = true,
      };

      return await _cloudinary.UploadAsync(uploadParams);
    }
  }
}