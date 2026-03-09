namespace server.Background.Queue
{
  public interface IBackgroundTaskQueue
  {
    void Queue(Func<CancellationToken, Task> workItem);
    Task<Func<CancellationToken, Task>> DequeueAsync(CancellationToken token);
  }

  public interface IBackgroundTaskQueue<T>
  {
    void Queue(T workItem);
    Task<T> DequeueAsync(CancellationToken token);
  }
}
