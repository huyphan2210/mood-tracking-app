using System.Text.Json;
using System.Text.RegularExpressions;
using server.Clients.GenAIClient;

namespace server.Services.LLMServices
{
  public partial class LLMServices(IGenAIClient genAIClient, ILogger<LLMServices> logger) : ILLMServices
  {
    [GeneratedRegex(@"```(?:json)?\s*(\{[\s\S]*?\})\s*```")]
    private static partial Regex MarkdownJsonRegex();
    private readonly IGenAIClient _genAIClient = genAIClient;
    private readonly ILogger<LLMServices> _logger = logger;

    public async Task<T?> PromptForJsonAsync<T>(
      string prompt,
      Func<string, string> retryPrompt,
      CancellationToken cancellationToken,
      int maxRetries = 3
    )
    {
      var currentPrompt = prompt;

      try
      {
        var jsonSerializeOption = new JsonSerializerOptions
        {
          PropertyNameCaseInsensitive = true
        };

        for (int attempt = 0; attempt < maxRetries; attempt++)
        {
          var response = await _genAIClient.SendPromptAsync(currentPrompt, cancellationToken);
          var cleanedJson = CleanJson(response);

          try
          {
            T deserializedJson = JsonSerializer.Deserialize<T>(cleanedJson, jsonSerializeOption)!;
            return deserializedJson;
          }
          catch (Exception ex) when (ex is JsonException or NotSupportedException)
          {
            if (attempt == maxRetries - 1)
              throw;

            currentPrompt = retryPrompt(response);
          }
        }
      }
      catch (HttpRequestException ex)
      {
        _logger.LogError("LLM request failed", ex);
        throw new LLMServicesExpcetion("LLM request failed", ex);
      }
      catch (Exception ex) when (ex is JsonException or NotSupportedException)
      {
        _logger.LogError($"All {maxRetries} attempts failed to deserialize json", ex);
        throw new LLMServicesExpcetion($"LLMClient failed to deserialize json from prompt: {currentPrompt}");
      }
      catch (Exception ex)
      {
        _logger.LogError("Unknown exception has happened", ex);
        throw new LLMServicesExpcetion("Unknown exception has happened", ex);
      }

      return default;
    }

    private static string CleanJson(string response)
    {
      response = response.Trim();

      var match = MarkdownJsonRegex().Match(response);
      if (match.Success)
      {
        response = match.Groups[1].Value.Trim();
      }

      try
      {
        response = JsonSerializer.Deserialize<string>(response)!;
      }
      catch
      {

      }

      return response;
    }
  }

  public class LLMServicesExpcetion : Exception
  {
    public LLMServicesExpcetion(string message) : base(message) { }
    public LLMServicesExpcetion(string message, Exception exception) : base(message, exception) { }
  }
}
