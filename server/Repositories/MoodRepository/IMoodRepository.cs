using server.Domain.Entities;

namespace server.Repositories.MoodRepository
{
  public interface IMoodRepository
  {
    public Task<Mood?> GetMoodByIdAsync(Guid moodId, CancellationToken token = default);
    public Task<Mood> CreateMoodAsync(Mood mood, CancellationToken token = default);
    public Task<Mood> UpdateMoodAsync(Mood mood, CancellationToken token = default);
  }
}