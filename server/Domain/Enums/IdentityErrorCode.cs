namespace server.Domain.Enums
{
  public enum IdentityErrorCode
  {
    PasswordRequiresNonAlphanumeric = 1,
    PasswordRequiresDigit = 2,
    PasswordRequiresLower = 3,
    PasswordRequiresUpper = 4,
    PasswordTooShort = 5,
    DuplicateUserName = 6,
    EmailIsInvalid = 7,
  }
}
