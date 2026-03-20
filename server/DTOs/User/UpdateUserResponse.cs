using System.Text.Json.Serialization;
using server.Domain.Enums.User;

namespace server.DTOs.User
{
  public class UpdateUserResponse
  {
    [JsonConverter(typeof(JsonStringEnumConverter))]
    public required UserStatus Status { get; set; }
    public required string JWT { get; set; }
  }
}