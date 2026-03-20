using System.IdentityModel.Tokens.Jwt;
using server.Data;
using server;

var builder = WebApplication.CreateBuilder(args);

DI.InjectDependencies(builder);

JwtSecurityTokenHandler.DefaultInboundClaimTypeMap.Clear();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

if (!app.Environment.IsEnvironment(DI.TEST_ENV))
{
    await DbInitializer.MigrateAsync(app.Services);
    await DbInitializer.InitializeAync(app.Services);
}

app.UseCors(DI.ALLOW_SPECIFIC_ORIGIN);

app.UseHttpsRedirection();

app.UseAuthentication();

app.UseAuthorization();

app.MapControllers();

app.UseExceptionHandler();

app.Use(async (context, next) =>
{
    var authHeader = context.Request.Headers.Authorization.FirstOrDefault();
    Console.WriteLine($"Authorization Header: {authHeader}");

    await next();
});

app.Run();
