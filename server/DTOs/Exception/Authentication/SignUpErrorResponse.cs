using server.Domain.Enums.User;

namespace server.DTOs.Exception.Authentication
{
  public class SignUpErrorResponse : ErrorResponse
  {
    public new IdentityErrorCode ErrorCode { get; set; }
  }
}