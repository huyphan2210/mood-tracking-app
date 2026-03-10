using System.Text.Json.Serialization;
using server.Domain.Enums.User;

namespace server.DTOs.Authentication
{
    public class AuthenticationBaseResponsePOST
    {
        [JsonConverter(typeof(JsonStringEnumConverter))]
        public required UserStatus Status { get; set; }
        public required string JWT { get; set; }
    }
}
