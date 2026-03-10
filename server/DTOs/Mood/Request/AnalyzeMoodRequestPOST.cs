using server.Domain.Enums.Mood;

namespace server.DTOs.Mood.Requests
{
  public class AnalyzeMoodRequestPOST
  {
    public List<Feeling> Feelings { get; set; } = [];
    public MoodName Mood { get; set; }
    public SleepHours SleepHours { get; set; }
    public required string MoodDescription { get; set; }
  }
}
