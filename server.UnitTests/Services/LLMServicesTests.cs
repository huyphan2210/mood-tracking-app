using Microsoft.Extensions.Logging;
using Moq;
using server.Clients.GenAIClient;
using server.Services.LLMServices;

namespace server.UnitTests.Services
{
  public partial class LLMServicesTests
  {
    private readonly Mock<IGenAIClient> _genAIClientMock = new();
    private readonly Mock<ILogger<LLMServices>> _loggerMock = new();
    private readonly LLMServices _llmServices;

    public LLMServicesTests()
    {
      _llmServices = new(_genAIClientMock.Object, _loggerMock.Object);
    }

    [Fact]
    public async Task PromptForJsonAsync_ShouldReturnExpectedJsonFirstTime_Succeed()
    {
      var mockReponse = """{ "mockResponse": "This is a mock response." }""";
      var prompt = "Return a JSON with this format { mockResponse: 'string' }";

      _genAIClientMock.Setup(client => client.SendPromptAsync(prompt, It.IsAny<CancellationToken>())).ReturnsAsync(mockReponse);

      var expectedResponse = await _llmServices.PromptForJsonAsync<MockLLMResponse>(prompt, response => "", default);

      Assert.IsType<MockLLMResponse>(expectedResponse);
    }

    [Fact]
    public async Task PromptForJsonAsync_ShouldReturnExpectedJsonForRetryPrompt_Succeed()
    {
      var mockReponse = """{ "mockResponse": "This is a mock response." }""";
      var prompt = "Don't Return anything";
      var retryPrompt = "Return a JSON with this format { mockResponse: 'string' }";

      _genAIClientMock.Setup(client => client.SendPromptAsync(prompt, It.IsAny<CancellationToken>())).ReturnsAsync("");
      _genAIClientMock.Setup(client => client.SendPromptAsync(retryPrompt, It.IsAny<CancellationToken>())).ReturnsAsync(mockReponse);

      var expectedResponse = await _llmServices.PromptForJsonAsync<MockLLMResponse>(prompt, response => retryPrompt, default);

      Assert.IsType<MockLLMResponse>(expectedResponse);
    }

    [Fact]
    public async Task PromptForJsonAsync_ShouldThrowLLMServicesExpcetion_MaxAttemptsExceeded()
    {
      var mockReponse = "";
      var prompt = "Return a JSON with this format { mockResponse: 'string' }";
      var retryPrompt = "Return strictly a JSON with this format { mockResponse: 'string' }";

      _genAIClientMock.Setup(client => client.SendPromptAsync(prompt, It.IsAny<CancellationToken>())).ReturnsAsync(mockReponse);
      _genAIClientMock.Setup(client => client.SendPromptAsync(retryPrompt, It.IsAny<CancellationToken>())).ReturnsAsync(mockReponse);

      var expectedException = await Assert.ThrowsAsync<LLMServicesExpcetion>(async () =>
        await _llmServices.PromptForJsonAsync<MockLLMResponse>(prompt, response => retryPrompt, default)
      );

      Assert.Equal($"LLMClient failed to deserialize json from prompt: {retryPrompt}", expectedException.Message);
    }

    [Fact]
    public async Task PromptForJsonAsync_ShouldThrowLLMServicesExpcetion_HttpRequestFailed()
    {
      var prompt = "Return a JSON with this format { mockResponse: 'string' }";
      var retryPrompt = "Return strictly a JSON with this format { mockResponse: 'string' }";

      _genAIClientMock.Setup(
        client => client.SendPromptAsync(It.IsAny<string>(), It.IsAny<CancellationToken>())
      ).ThrowsAsync(new HttpRequestException(""));

      var expectedException = await Assert.ThrowsAsync<LLMServicesExpcetion>(async () =>
        await _llmServices.PromptForJsonAsync<MockLLMResponse>(prompt, response => retryPrompt, default)
      );

      Assert.Equal("LLM request failed", expectedException.Message);
    }

    [Fact]
    public async Task PromptForJsonAsync_ShouldThrowLLMServicesExpcetion_UnkownExceptionHappened()
    {
      var prompt = "Return a JSON with this format { mockResponse: 'string' }";
      var retryPrompt = "Return strictly a JSON with this format { mockResponse: 'string' }";

      _genAIClientMock.Setup(
        client => client.SendPromptAsync(It.IsAny<string>(), It.IsAny<CancellationToken>())
      ).ThrowsAsync(new Exception(""));

      var expectedException = await Assert.ThrowsAsync<LLMServicesExpcetion>(async () =>
        await _llmServices.PromptForJsonAsync<MockLLMResponse>(prompt, response => retryPrompt, default)
      );

      Assert.Equal("Unknown exception has happened", expectedException.Message);
    }
  }

  public class MockLLMResponse
  {
    public string? MockReponse { get; set; }
  }
}