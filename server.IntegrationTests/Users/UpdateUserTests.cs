using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using server.Domain.Entities;
using server.Domain.Enums.User;
using server.DTOs.Exception;
using server.DTOs.User;

namespace server.IntegrationTests.Users
{
  public class UpdateUserTests(CustomWebApplicationFactory factory) : BaseTests(factory)
  {
    private const string requestUrl = "/api/user/update";

    [Fact]
    public async Task UpdateUser_ShouldThrow401Unauthorized_NoTokenInHeader()
    {
      var request = new UpdateUserRequestPATCH();

      var result = await _httpClient.PatchAsJsonAsync(requestUrl, request);

      Assert.Equal(HttpStatusCode.Unauthorized, result.StatusCode);
    }

    [Fact]
    public async Task UpdateUser_ShouldThrow404NotFound_UserNotFound()
    {
      var request = new UpdateUserRequestPATCH();
      var httpRequest = CreateAuthorizedRequestForJson(HttpMethod.Patch, requestUrl, request, true);

      var response = await _httpClient.SendAsync(httpRequest);
      var result = await response.Content.ReadFromJsonAsync<ErrorResponse>();

      Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
      Assert.Equal(IdentityErrorCode.UserNotFound.ToString(), result?.ErrorCode);
    }

    [Fact]
    public async Task UpdateUser_ShouldUpdateFullName_Succeed()
    {
      var content = new MultipartFormDataContent
      {
        { new StringContent("Not Seed User"), "FullName" }
      };

      var request = new HttpRequestMessage(HttpMethod.Patch, requestUrl)
      {
        Content = content,
      };
      request.Headers.Authorization = new AuthenticationHeaderValue(TestAuthHandler.Scheme);

      var httpRequest = CreateAuthorizedRequestForJson(HttpMethod.Patch, requestUrl, request);

      var response = await _httpClient.SendAsync(request);

      Assert.Equal(HttpStatusCode.OK, response.StatusCode);

      using var scope = _scopeFactory.CreateScope();
      var userManager = scope.ServiceProvider.GetRequiredService<UserManager<User>>();

      var user = await userManager.Users.FirstOrDefaultAsync(user => user.Id == SeedData.DefaultSeedUser.Id);
      Assert.Equal("Not Seed User", user?.FullName);
    }

    [Fact]
    public async Task UpdateUser_ShouldThrow400BadRequest_ImageLargerThan250KB()
    {

      var response = await _httpClient.SendAsync(CreateHttpRequestWithInvalidImage("avatar.jpg", 260));
      Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);

      var result = await response.Content.ReadFromJsonAsync<ErrorResponse>();
      Assert.Equal("ImageIsInvalid", result?.ErrorCode);
      Assert.Equal("Unsupported file type or size. Please upload a PNG or JPEG with the maximum of 250KB", result?.Message);
    }

    [Fact]
    public async Task UpdateUser_ShouldThrow400BadRequest_ImageIsNotPNGorJPG()
    {

      var response = await _httpClient.SendAsync(CreateHttpRequestWithInvalidImage("avatar.txt", 240));
      Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);

      var result = await response.Content.ReadFromJsonAsync<ErrorResponse>();
      Assert.Equal("ImageIsInvalid", result?.ErrorCode);
      Assert.Equal("Unsupported file type or size. Please upload a PNG or JPEG with the maximum of 250KB", result?.Message);
    }

    [Fact]
    public async Task UpdateUser_ShouldThrow500InternalServerError_FailedToUploadImage()
    {
      var response = await _httpClient.SendAsync(CreateHttpRequestWithInvalidImage("avatar.png", 240));
      Assert.Equal(HttpStatusCode.InternalServerError, response.StatusCode);

      var result = await response.Content.ReadFromJsonAsync<ErrorResponse>();
      Assert.Equal("InternalServerError", result?.ErrorCode);
    }

    [Fact]
    public async Task UpdateUser_ShouldUpdateFullNameAndAvatarURL_Succeed()
    {

      var response = await _httpClient.SendAsync(CreateHttpRequestWithMockImage("avatar.jpg"));

      Assert.Equal(HttpStatusCode.OK, response.StatusCode);

      using var scope = _scopeFactory.CreateScope();
      var userManager = scope.ServiceProvider.GetRequiredService<UserManager<User>>();

      var user = await userManager.Users.FirstOrDefaultAsync(user => user.Id == SeedData.DefaultSeedUser.Id);
      Assert.Equal("Not Seed User", user?.FullName);
      Assert.NotNull(user?.AvatarURL);
    }

    private static HttpRequestMessage CreateHttpRequestWithInvalidImage(string fileName, int sizeInKB)
    {
      var content = new MultipartFormDataContent
      {
        { new StringContent("Not Seed User"), "FullName" }
      };

      var bytes = new byte[sizeInKB * 1024];
      var fileContent = new ByteArrayContent(bytes);
      fileContent.Headers.ContentType = new MediaTypeHeaderValue("image/jpeg");
      content.Add(fileContent, "AvatarImage", fileName);

      var request = new HttpRequestMessage(HttpMethod.Patch, requestUrl)
      {
        Content = content
      };

      request.Headers.Authorization =
        new AuthenticationHeaderValue(TestAuthHandler.Scheme);

      return request;
    }

    private static HttpRequestMessage CreateHttpRequestWithMockImage(string fileName)
    {
      var content = new MultipartFormDataContent
      {
        { new StringContent("Not Seed User"), "FullName" }
      };

      var imageBytes = Convert.FromBase64String(
        "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGNgYAAAAAMAASsJTYQAAAAASUVORK5CYII=");
      var fileContent = new ByteArrayContent(imageBytes);
      fileContent.Headers.ContentType = new MediaTypeHeaderValue("image/jpeg");
      content.Add(fileContent, "AvatarImage", fileName);

      var request = new HttpRequestMessage(HttpMethod.Patch, requestUrl)
      {
        Content = content
      };

      request.Headers.Authorization =
        new AuthenticationHeaderValue(TestAuthHandler.Scheme);

      return request;
    }
  }
}