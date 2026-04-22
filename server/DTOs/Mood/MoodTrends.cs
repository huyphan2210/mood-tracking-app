namespace server.DTOs.Mood
{
  public class MoodTrends
  {
    public required IEnumerable<MoodResponse> MoodList { get; set; }
  }
}