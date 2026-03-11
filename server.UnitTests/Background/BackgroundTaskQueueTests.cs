using server.Background.Queue;

namespace server.UnitTests.Background
{
  public class BackgroundTaskQueueTests
  {
    [Fact]
    public async Task Queue_ShouldAddItem_AndDequeueShouldReturnIt()
    {
      var queue = new BackgroundTaskQueue<string>();

      queue.Queue("hello");
      var result = await queue.DequeueAsync(default);

      Assert.Equal("hello", result);
    }

    [Fact]
    public async Task Queue_ShouldPreserveOrder_True()
    {
      var queue = new BackgroundTaskQueue<int>();

      queue.Queue(1);
      queue.Queue(2);
      queue.Queue(3);

      var result1 = await queue.DequeueAsync(default);
      var result2 = await queue.DequeueAsync(default);
      var result3 = await queue.DequeueAsync(default);

      Assert.Equal(1, result1);
      Assert.Equal(2, result2);
      Assert.Equal(3, result3);
    }

    [Fact]
    public async Task Queue_ShouldExecuteQueuedWorkItem_True()
    {
      var queue = new BackgroundTaskQueue();
      var executed = false;

      queue.Queue(async token =>
      {
        executed = true;
      });

      var workItem = await queue.DequeueAsync(default);

      await workItem(default);

      Assert.True(executed);
    }
  }
}