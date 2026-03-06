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

      httpContext.Response.StatusCode = StatusCodes.Status500InternalServerError;
      ErrorResponse errorResponse = new()
      {
        ErrorCode = "InternalServerError",
        Message = "An unexpected error occurred."
      };


      if (exception is AppException appException)
      {
        httpContext.Response.StatusCode = appException.StatusCode;
        errorResponse = new()
        {
          ErrorCode = appException.ErrorCode,
          Message = appException.Message
        };
      }

      await httpContext.Response.WriteAsJsonAsync(
          errorResponse,
          cancellationToken
      );

      return true;
    }
  }
}
