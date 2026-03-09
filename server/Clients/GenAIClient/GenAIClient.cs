using System.Text.Json;
using System.Text.RegularExpressions;
using Google.GenAI;

namespace server.Clients.GenAIClient
{
  public partial class GenAIClient : IGenAIClient
  {
    private const string model = "gemini-2.5-flash";
    private readonly Client _client;

    public GenAIClient(IConfiguration configuration)
    {
      var apiKey = configuration["Gemini:Apikey"];
      _client = new(apiKey: apiKey);
    }

    public async Task<string> SendPromptAsync(string prompt, CancellationToken cancellationToken)
    {
      var response = await _client.Models.GenerateContentAsync(
         model,
         prompt,
         cancellationToken: cancellationToken
       );

      return response.Text ?? "";
    }
  }
}