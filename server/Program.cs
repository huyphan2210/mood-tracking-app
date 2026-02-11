using server.Services.AuthenticationServices;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
AddCustomServices(builder);

builder.Services.AddControllers();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();

static void AddCustomServices(WebApplicationBuilder builder)
{
    builder.Services.AddScoped<IAuthenticationServices, AuthenticationServices>();
}
