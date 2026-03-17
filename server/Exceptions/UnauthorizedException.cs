namespace server.Exceptions
{
  public sealed class UnauthorizedException(string errorCode, string message) : AppException(errorCode, message, StatusCodes.Status401Unauthorized)
  {
  }
}