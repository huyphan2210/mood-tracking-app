using server.Domain.Enums.Mood;

namespace server.DTOs.Mood
{
  public class MoodTrends
  {
    public required IEnumerable<MoodResponse> MoodList { get; set; }
    public SleepHours AverageSleepHours { get; set; }
    public MoodName AverageMood { get; set; }
  }
}