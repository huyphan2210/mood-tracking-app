using Google.GenAI;

namespace server.Clients.GenAIClient
{
  public class GenAIClient(Client client) : IGenAIClient
  {
    private const string model = "gemini-2.5-flash";
    private readonly Client _client = client;

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