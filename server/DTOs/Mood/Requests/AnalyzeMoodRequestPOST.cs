using System.ComponentModel.DataAnnotations;
using server.Domain.Enums.Mood;

namespace server.DTOs.Mood.Requests
{
  public class AnalyzeMoodRequestPOST
  {
    [MinLength(1)]
    public required List<Feeling> Feelings { get; set; } = [];
    public required MoodName Mood { get; set; }
    public required SleepHours SleepHours { get; set; }
    public required string MoodDescription { get; set; }
  }
}
