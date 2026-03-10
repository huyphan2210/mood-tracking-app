using System.Threading.Channels;

namespace server.Background.Queue
{
  public class BackgroundTaskQueue : IBackgroundTaskQueue
  {
    private readonly Channel<Func<CancellationToken, Task>> _queue =
        Channel.CreateUnbounded<Func<CancellationToken, Task>>();

    public void Queue(Func<CancellationToken, Task> workItem)
    {
      _queue.Writer.TryWrite(workItem);
    }

    public async Task<Func<CancellationToken, Task>> DequeueAsync(CancellationToken token)
    {
      return await _queue.Reader.ReadAsync(token);
    }
  }

  public class BackgroundTaskQueue<T> : IBackgroundTaskQueue<T>
  {
    private readonly Channel<T> _queue = Channel.CreateUnbounded<T>();

    public void Queue(T workItem)
    {
      _queue.Writer.TryWrite(workItem);
    }

    public async Task<T> DequeueAsync(CancellationToken token)
    {
      return await _queue.Reader.ReadAsync(token);
    }
  }
}
