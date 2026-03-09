namespace server.Clients.LLMClient
{
  public interface ILLMClient
  {
    public Task<T?> PromptForJsonAsync<T>(
      string prompt,
      Func<string, string> retryPrompt,
      CancellationToken cancellationToken,
      int maxRetries = 3
    );
  }
}