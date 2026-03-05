namespace server.Exceptions
{
  public sealed class NotFoundException(string errorCode, string message) : AppException(errorCode, message, StatusCodes.Status404NotFound)
  {
  }
}