using server.DTOs.Mood;
using server.DTOs.Mood.Requests;

namespace server.Services.MoodServices
{
  public interface IMoodServices
  {
    public Task<MoodResponse?> GetSingleMoodAsync(DateTime startDate, DateTime endDate, Guid userId);
    public Task<MoodTrends> GetMoodTrendsAsync(DateTime startDate, DateTime endDate, Guid userId);
    public Task AnalyzeMoodAsync(AnalyzeMoodRequestPOST analyzeMoodRequestPost, Guid userId);
  }
}