using System.Security.Claims;
using System.Text.Encodings.Web;
using Microsoft.AspNetCore.Authentication;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace server.IntegrationTests
{
  public class TestAuthHandler(
      IOptionsMonitor<AuthenticationSchemeOptions> options,
      ILoggerFactory logger,
      UrlEncoder encoder
    ) : AuthenticationHandler<AuthenticationSchemeOptions>(options, logger, encoder)
  {
    public new const string Scheme = "Test";

    protected override Task<AuthenticateResult> HandleAuthenticateAsync()
    {
      if (!Request.Headers.ContainsKey("Authorization"))
        return Task.FromResult(AuthenticateResult.Fail("Missing Authorization Header"));
        
      var claims = new[]
      {
        new Claim(ClaimTypes.NameIdentifier, "95ab17f3-25e4-41a5-aa2a-454f0091301b"),
        new Claim(ClaimTypes.Email, "seed@test.com")
      };

      var identity = new ClaimsIdentity(claims, Scheme);
      var principal = new ClaimsPrincipal(identity);
      var ticket = new AuthenticationTicket(principal, Scheme);

      return Task.FromResult(AuthenticateResult.Success(ticket));
    }
  }
}