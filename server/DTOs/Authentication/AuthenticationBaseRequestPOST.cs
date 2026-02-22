namespace server.DTOs.Authentication
{
    public class AuthenticationBaseRequestPOST
    {
        public required string Email { get; set; }
        public required string Password { get; set; }
    }
}