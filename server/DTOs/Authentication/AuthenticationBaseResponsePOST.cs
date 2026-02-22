using server.Domain.Enums;

namespace server.DTOs.Authentication
{
    public class AuthenticationBaseResponsePOST
    {
        public required UserStatus Status { get; set; }
        public required string JWT { get; set; }
    }
}