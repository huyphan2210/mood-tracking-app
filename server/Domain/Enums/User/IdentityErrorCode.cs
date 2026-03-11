using System.Text.Json.Serialization;

namespace server.Domain.Enums.User
{
  [JsonConverter(typeof(JsonStringEnumConverter))]
  public enum IdentityErrorCode
  {
    PasswordRequiresNonAlphanumeric = 1,
    PasswordRequiresDigit = 2,
    PasswordRequiresLower = 3,
    PasswordRequiresUpper = 4,
    PasswordTooShort = 5,
    DuplicateUserName = 6,
    EmailIsInvalid = 7,
    UserNotFound = 8
  }
}
