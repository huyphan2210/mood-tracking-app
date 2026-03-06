using Microsoft.Extensions.DependencyInjection;

namespace server.IntegrationTests.Authentication
{
  public class AuthenticationBaseTests : IClassFixture<CustomWebApplicationFactory>
  {
    protected readonly HttpClient _httpClient;
    protected readonly IServiceScopeFactory _scopeFactory;

    public AuthenticationBaseTests(CustomWebApplicationFactory factory)
    {
      _httpClient = factory.CreateClient();
      _scopeFactory = factory.Services.GetRequiredService<IServiceScopeFactory>();
      factory.SeedAsync().Wait();
    }
  }
}