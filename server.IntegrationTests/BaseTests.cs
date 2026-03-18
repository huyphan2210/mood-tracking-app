using System.Net.Http.Headers;
using System.Net.Http.Json;
using Microsoft.Extensions.DependencyInjection;

namespace server.IntegrationTests
{
  public class BaseTests(CustomWebApplicationFactory factory) : IClassFixture<CustomWebApplicationFactory>, IAsyncLifetime
  {
    protected readonly HttpClient _httpClient = factory.CreateClient();
    protected readonly IServiceScopeFactory _scopeFactory = factory.Services.GetRequiredService<IServiceScopeFactory>();
    protected readonly CustomWebApplicationFactory _factory = factory;

    public async Task InitializeAsync()
    {
      await _factory.InitializeAsync();
      await _factory.ResetDatabaseAsync();
      await _factory.SeedUserAsync();
    }

    public Task DisposeAsync() => Task.CompletedTask;

    protected static HttpRequestMessage CreateAuthorizedRequestForJson(HttpMethod method, string url, object body, bool withNonExistUser = false)
    {
      var request = new HttpRequestMessage(method, url)
      {
        Content = JsonContent.Create(body)
      };

      request.Headers.Authorization = new AuthenticationHeaderValue(TestAuthHandler.Scheme);
      if (withNonExistUser)
      {
        request.Headers.Add("X-Test-User", "non-existing");
      }

      return request;
    }
  }
}