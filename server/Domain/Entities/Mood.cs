using server.Domain.Enums.Mood;

namespace server.Domain.Entities
{
  public class Mood : BaseEntity
  {
    public List<Feeling> Feelings { get; set; } = [];
    public MoodName MoodName { get; set; }
    public SleepHours SleepHours { get; set; }
    public required string MoodDescription { get; set; }
    public string? LlmAdvice { get; set; }
    public string? LlmAnalysis { get; set; }
    public Guid UserId { get; set; }
    public User User { get; set; } = default!;
  }
}