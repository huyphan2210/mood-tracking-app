namespace server.Domain.Enums
{
  public enum IdentityErrorCode
  {
    PasswordRequiresNonAlphanumeric = 1,
    PasswordRequiresDigit = 2,
    PasswordRequiresLower = 3,
    PasswordRequiresUpper = 4,
    DuplicateUserName = 5,
  }
}
