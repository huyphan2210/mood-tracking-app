using System.Text.Json;
using System.Text.RegularExpressions;
using Google.GenAI;

namespace server.Clients.LLMClient
{
  public partial class LLMClient : ILLMClient
  {
    [GeneratedRegex(@"```(?:json)?\s*(\{[\s\S]*?\})\s*```")]
    private static partial Regex MarkdownJsonRegex();
    private const string model = "gemini-2.5-flash";
    private readonly Client _client;
    private readonly ILogger<LLMClient> _logger;

    public LLMClient(IConfiguration configuration, ILogger<LLMClient> logger)
    {
      var apiKey = configuration["Gemini:Apikey"];
      _client = new(apiKey: apiKey);
      _logger = logger;
    }

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
          var response = await SendPromptAsync(currentPrompt, cancellationToken);
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
        throw new LLMClientExpcetion("LLM request failed", ex);
      }
      catch (Exception ex) when (ex is JsonException or NotSupportedException)
      {
        _logger.LogError($"All {maxRetries} attempts failed to deserialize json", ex);
        throw new LLMClientExpcetion($"LLMClient failed to deserialize json from prompt: {currentPrompt}");
      }
      catch (Exception ex)
      {
        _logger.LogError("Unknown exception has happened", ex);
        throw new LLMClientExpcetion("Unknown exception has happened", ex);
      }

      return default;
    }

    private async Task<string> SendPromptAsync(string prompt, CancellationToken cancellationToken)
    {
      var response = await _client.Models.GenerateContentAsync(
         model,
         prompt,
         cancellationToken: cancellationToken
       );

      return response.Text ?? "";
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

  public class LLMClientExpcetion : Exception
  {
    public LLMClientExpcetion(string message) : base(message) { }
    public LLMClientExpcetion(string message, Exception exception) : base(message, exception) { }
  }
}
