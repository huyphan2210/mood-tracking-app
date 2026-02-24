using Microsoft.AspNetCore.Diagnostics;
using server.DTOs.Exception;

namespace server.Exceptions
{
  public class GlobalExceptionHandler(ILogger<GlobalExceptionHandler> logger) : IExceptionHandler
  {
    private readonly ILogger<GlobalExceptionHandler> _logger = logger;

    public async ValueTask<bool> TryHandleAsync(HttpContext httpContext, Exception exception, CancellationToken cancellationToken)
    {
      _logger.LogError(exception, "Unhandled exception occurred.");
      var statusCode = exception switch
      {
        ValidationException => StatusCodes.Status400BadRequest,
        NotFoundException => StatusCodes.Status404NotFound,
        _ => StatusCodes.Status500InternalServerError
      };

      httpContext.Response.StatusCode = statusCode;

      await httpContext.Response.WriteAsJsonAsync(
          new ErrorResponse
          {
            Error = exception.Message
          },
          cancellationToken
      );

      return true;
    }
  }
}
