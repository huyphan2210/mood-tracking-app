using System.Text.Json.Serialization;

namespace server.Domain.Enums.Mood
{
  [JsonConverter(typeof(JsonStringEnumConverter))]
  public enum MoodName
  {
    VerySad = 1,
    Sad = 2,
    Neutral = 3,
    Happy = 4,
    VeryHappy = 5
  }
}