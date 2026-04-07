using server.Domain.Enums.Mood;

namespace server.DTOs.Mood
{
  public class MoodResponse
  {
    public MoodName MoodName { get; set; }
    public SleepHours SleepHours { get; set; }
    public string? Analysis { get; set; }
    public string? Advice { get; set; }
    public string? Motto { get; set; }
     public DateTime Date { get; set; }
  }
}