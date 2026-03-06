using System.Text.Json.Serialization;
using server.Domain.Enums;

namespace server.DTOs.Exception.Authentication
{
  public class SignUpErrorResponse : ErrorResponse
  {
    [JsonConverter(typeof(JsonStringEnumConverter))]
    public new IdentityErrorCode ErrorCode { get; set; }
  }
}