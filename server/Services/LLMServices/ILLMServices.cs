namespace server.Services.LLMServices
{
  public interface ILLMServices
  {
    public Task<T?> PromptForJsonAsync<T>(
      string prompt,
      Func<string, string> retryPrompt,
      CancellationToken cancellationToken,
      int maxRetries = 3
    );
  }
}