using System.Text.Json.Serialization;

namespace server.Domain.Enums.Mood
{
  [JsonConverter(typeof(JsonStringEnumConverter))]
  public enum Feeling
  {
    // Very negative
    Overwhelmed = 1,
    Stressed = 2,
    Anxious = 3,
    Frustrated = 4,
    Disappointed = 5,

    // Negative
    Lonely = 6,
    Irritable = 7,
    Down = 8,
    Restless = 9,

    // Neutral / low energy
    Tired = 10,
    Calm = 11,
    Content = 12,
    Peaceful = 13,

    // Positive
    Hopeful = 14,
    Motivated = 15,
    Grateful = 16,
    Optimistic = 17,

    // Very positive
    Confident = 18,
    Excited = 19,
    Joyful = 20
  }
}