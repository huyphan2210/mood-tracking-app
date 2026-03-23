using CloudinaryDotNet.Actions;

namespace server.Clients.StorageClient
{
  public interface IStorageClient
  {
    public Task<ImageUploadResult> UploadImageAsync(IFormFile file);
  }
}