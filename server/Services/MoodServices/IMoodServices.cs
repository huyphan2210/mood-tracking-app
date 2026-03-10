using server.DTOs.Mood.Requests;

namespace server.Services.MoodServices
{
  public interface IMoodServices
  {
    public Task AnalyzeMoodAsync(AnalyzeMoodRequestPOST analyzeMoodRequestPost, string userId);
  }
}