namespace server.Exceptions
{
  public sealed class ValidationException(string errorCode, string message) : AppException(errorCode, message, StatusCodes.Status400BadRequest)
  {
  }
}