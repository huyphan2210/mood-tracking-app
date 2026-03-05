namespace server.DTOs.Exception
{
  public class ErrorResponse
  {
    public string? ErrorCode { get; set; }
    public required string Message { get; set; }
  }
}