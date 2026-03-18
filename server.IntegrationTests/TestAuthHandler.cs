using System.Security.Claims;
using System.Text.Encodings.Web;
using Microsoft.AspNetCore.Authentication;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using server.Domain.Entities;

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
        new Claim(ClaimTypes.NameIdentifier, SeedData.DefaultSeedUser.Id.ToString()),
        new Claim(ClaimTypes.Email, SeedData.DefaultSeedUser.Email!.ToString())
      };

      var type = Request.Headers["X-Test-User"].FirstOrDefault();
      if (type == "non-existing")
      {
        claims =
        [
          new Claim(ClaimTypes.NameIdentifier, Guid.Empty.ToString()),
          new Claim(ClaimTypes.Email, "nonexisting@unreal.com")
        ];
      }

      var identity = new ClaimsIdentity(claims, Scheme);
      var principal = new ClaimsPrincipal(identity);
      var ticket = new AuthenticationTicket(principal, Scheme);

      return Task.FromResult(AuthenticateResult.Success(ticket));
    }
  }

  public static class SeedData
  {
    public static User DefaultSeedUser { get; } = new()
    {
      Id = Guid.Parse("95ab17f3-25e4-41a5-aa2a-454f0091301b"),
      Email = "seed@test.com",
      UserName = "seed@test.com",
      FullName = "Seed User"
    };
  }
}