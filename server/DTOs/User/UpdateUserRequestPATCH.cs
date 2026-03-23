using System.ComponentModel.DataAnnotations;

namespace server.DTOs.User
{
  public class UpdateUserRequestPATCH : IValidatableObject
  {
    public string? FullName { get; set; }
    public IFormFile? AvatarImage { get; set; }

    public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
    {
      if (string.IsNullOrEmpty(FullName) && AvatarImage is null)
      {
        yield return new ValidationResult(
          "At least one field must be provided.",
          [nameof(FullName), nameof(AvatarImage)]
        );
      }

      if (AvatarImage is not null)
      {
        const long maxImageSize = 250 * 1024;
        string[] allowedExtensions = [".jpg", ".jpeg", ".png"];
        string extension = Path.GetExtension(AvatarImage.FileName).ToLowerInvariant();

        if (!allowedExtensions.Contains(extension))
        {
          yield return new ValidationResult(
          "Unsupported file type or size. Please upload a PNG or JPEG.",
            [nameof(AvatarImage)]
          );
        }

        if (AvatarImage.Length > maxImageSize)
        {
          yield return new ValidationResult(
            "Please upload an image with the maximum size of 250KB.",
              [nameof(AvatarImage)]
          );
        }
      }
    }
  }

}