using System.Net;
using System.Net.Http.Json;
using server.Domain.Entities;
using server.Domain.Enums.User;
using server.DTOs.Authentication;
using server.DTOs.Exception;

namespace server.IntegrationTests.Authentication
{
  public class LoginTests(CustomWebApplicationFactory factory) : BaseTests(factory)
  {
    private const string requestUrl = "/api/auth/login";

    [Fact]
    public async Task Login_ShouldReturnJWTAndStatus_WhenUserExists()
    {
      AuthenticationLoginRequestPOST request = new()
      {
        Email = "seed@test.com",
        Password = "Password123!"
      };

      HttpResponseMessage response = await _httpClient.PostAsJsonAsync(requestUrl, request);
      AuthenticationBaseResponsePOST? result = await response.Content.ReadFromJsonAsync<AuthenticationBaseResponsePOST>();

      Assert.Equal(HttpStatusCode.OK, response.StatusCode);
      Assert.IsType<AuthenticationBaseResponsePOST>(result);

      Assert.Equal(UserStatus.Active, result.Status);
      Assert.NotNull(result.JWT);
    }

    [Fact]
    public async Task Login_ShouldReturnUnauthorizedStatus_WhenUserDoesNotExist()
    {
      AuthenticationLoginRequestPOST request = new()
      {
        Email = "seed1@test.com",
        Password = "Password123!"
      };

      HttpResponseMessage response = await _httpClient.PostAsJsonAsync(requestUrl, request);
      ErrorResponse? result = await response.Content.ReadFromJsonAsync<ErrorResponse>();

      Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
      Assert.IsType<ErrorResponse>(result);

      Assert.Equal(IdentityErrorCode.UserNotFound.ToString(), result.ErrorCode);
      Assert.Equal("Either the email or password is invalid", result.Message);
    }

    [Fact]
    public async Task Login_ShouldReturnUnauthorizedStatus_WhenPasswordDoesNotMatch()
    {
      AuthenticationLoginRequestPOST request = new()
      {
        Email = "seed@test.com",
        Password = "Password1234!"
      };

      HttpResponseMessage response = await _httpClient.PostAsJsonAsync(requestUrl, request);
      ErrorResponse? result = await response.Content.ReadFromJsonAsync<ErrorResponse>();

      Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
      Assert.IsType<ErrorResponse>(result);

      Assert.Equal(IdentityErrorCode.UserNotFound.ToString(), result.ErrorCode);
      Assert.Equal("Either the email or password is invalid", result.Message);
    }

    [Fact]
    public async Task Login_ShouldReturnUnauthorizedStatus_WhenUserIsSoftDeleted()
    {
      var user = new User
      {
        Email = "seed1@test.com",
        UserName = "seed1@test.com",
        FullName = "Seed User 1",
        IsDeleted = true
      };

      await factory.SeedUserAsync(user);

      AuthenticationLoginRequestPOST request = new()
      {
        Email = "seed1@test.com",
        Password = "Password123!"
      };

      HttpResponseMessage response = await _httpClient.PostAsJsonAsync(requestUrl, request);
      ErrorResponse? result = await response.Content.ReadFromJsonAsync<ErrorResponse>();

      Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
      Assert.IsType<ErrorResponse>(result);

      Assert.Equal(IdentityErrorCode.UserNotFound.ToString(), result.ErrorCode);
      Assert.Equal("Either the email or password is invalid", result.Message);
    }
  }
}