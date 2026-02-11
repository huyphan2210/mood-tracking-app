namespace server.Models.DTOs.Authentication
{
    public class AuthenticationBasePOST
    {
        public required string Email { get; set; }
        public required string Password { get; set; }
    }
}