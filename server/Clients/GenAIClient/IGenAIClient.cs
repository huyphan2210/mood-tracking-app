namespace server.Clients.GenAIClient
{
  public interface IGenAIClient
  {
    Task<string> SendPromptAsync(string prompt, CancellationToken cancellationToken);
    
  }
}