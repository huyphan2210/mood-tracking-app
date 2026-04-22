using Microsoft.EntityFrameworkCore;
using server.Data;
using server.Domain.Entities;

namespace server.Repositories.MoodRepository
{
  public class MoodRepository(AppDbContext context) : IMoodRepository
  {
    private readonly AppDbContext _context = context;

    public async Task<Mood?> GetMoodByIdAsync(Guid moodId, CancellationToken cancellationToken = default)
    {
      var mood = await _context.Moods.FirstOrDefaultAsync(mood => mood.Id == moodId && mood.IsDeleted == false, cancellationToken);

      return mood;
    }

    public async Task<List<Mood>> GetMoodsByUserIdAsync(Guid userId, CancellationToken cancellationToken = default)
    {
      var moods = await _context.Moods.Where(mood => mood.UserId == userId && mood.IsDeleted == false).ToListAsync(cancellationToken);

      return moods;
    }

    public async Task<Mood> CreateMoodAsync(Mood mood, CancellationToken cancellationToken = default)
    {
      await _context.Moods.AddAsync(mood, cancellationToken);
      await _context.SaveChangesAsync(cancellationToken);

      return mood;
    }

    public async Task<Mood> UpdateMoodAsync(Mood mood, CancellationToken cancellationToken = default)
    {
      mood.UpdatedAt = DateTime.UtcNow;
      _context.Entry(mood).State = EntityState.Modified;

      await _context.SaveChangesAsync(cancellationToken);

      return mood;
    }
  }
}