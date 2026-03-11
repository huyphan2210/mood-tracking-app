using System.Text.Json.Serialization;

namespace server.Domain.Enums.Mood
{
  [JsonConverter(typeof(JsonStringEnumConverter))]
  public enum SleepHours
  {
    ZeroToTwo = 1,
    ThreeToFour = 2,
    FiveToSix = 3,
    SevenToEight = 4,
    NinePlus = 5
  }
}
