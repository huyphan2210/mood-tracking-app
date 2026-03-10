using System.Net;
using System.Net.Http.Json;
using server.Domain.Enums.User;
using server.DTOs.Authentication;
using server.DTOs.Exception;

namespace server.IntegrationTests.Authentication
{
  public class SignUpTests(CustomWebApplicationFactory factory) : AuthenticationBaseTests(factory)
  {
    private const string requestUrl = "/api/auth/sign-up";

    [Fact]
    public async Task SignUp_ShouldReturnOk_WhenRequestIsValid()
    {
      AuthenticationSignUpRequestPOST request = new()
      {
        Email = "test@yopmail.com",
        Password = "Valid@Password123"
      };

      HttpResponseMessage response = await _httpClient.PostAsJsonAsync(requestUrl, request);
      AuthenticationBaseResponsePOST? result = await response.Content.ReadFromJsonAsync<AuthenticationBaseResponsePOST>();

      Assert.Equal(HttpStatusCode.OK, response.StatusCode);
      Assert.IsType<AuthenticationBaseResponsePOST>(result);
      Assert.Equal(UserStatus.NoFullName, result.Status);
    }

    [Fact]
    public async Task SignUp_ShouldReturnBadRequest_WhenUserIsDuplicated()
    {
      AuthenticationSignUpRequestPOST request = new()
      {
        Email = "seed@test.com",
        Password = "Valid@Password123"
      };

      HttpResponseMessage response = await _httpClient.PostAsJsonAsync(requestUrl, request);
      ErrorResponse? result = await response.Content.ReadFromJsonAsync<ErrorResponse>();

      Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
      Assert.IsType<ErrorResponse>(result);
      Assert.Equal(IdentityErrorCode.DuplicateUserName.ToString(), result.ErrorCode);
    }

    [Fact]
    public async Task SignUp_ShouldReturnBadRequest_WhenEmailIsInvalid()
    {
      AuthenticationSignUpRequestPOST request = new()
      {
        Email = "seed",
        Password = "Valid@Password123"
      };

      HttpResponseMessage response = await _httpClient.PostAsJsonAsync(requestUrl, request);
      ErrorResponse? result = await response.Content.ReadFromJsonAsync<ErrorResponse>();

      Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
      Assert.IsType<ErrorResponse>(result);
      Assert.Equal("Email is invalid", result.Message);
    }

    [Theory]
    [InlineData("1a@")]
    [InlineData("123456")]
    [InlineData("abcdef")]
    [InlineData("abcd1@")]
    [InlineData("ABCD1@")]
    public async Task SignUp_ShouldReturnBadRequest_WhenPasswordIsInvalid(string invalidPassword)
    {
      AuthenticationSignUpRequestPOST request = new()
      {
        Email = "test@yopmail.com",
        Password = invalidPassword
      };

      HttpResponseMessage response = await _httpClient.PostAsJsonAsync(requestUrl, request);
      ErrorResponse? result = await response.Content.ReadFromJsonAsync<ErrorResponse>();

      Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
      Assert.IsType<ErrorResponse>(result);

      Assert.Contains(result.ErrorCode, new List<string>
      {
        IdentityErrorCode.PasswordRequiresDigit.ToString(),
        IdentityErrorCode.PasswordRequiresLower.ToString(),
        IdentityErrorCode.PasswordRequiresUpper.ToString(),
        IdentityErrorCode.PasswordRequiresNonAlphanumeric.ToString(),
        IdentityErrorCode.PasswordTooShort.ToString(),
      });
    }
  }
}