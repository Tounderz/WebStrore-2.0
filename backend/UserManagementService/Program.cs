using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using UserManagementService.Data;
using UserManagementService.Data.Abstract;
using UserManagementService.Data.Implementation;
using UserManagementService.Models.Configurations;

#pragma warning disable CS8604
#pragma warning disable CS8634

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors();
builder.Services.AddDbContext<UserDBContext>(options => options.UseSqlServer(builder.Configuration.GetConnectionString("Default")));
builder.Services.AddAuthorization();

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.RequireHttpsMetadata = false;
        options.SaveToken = true;
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]))
        };
    });

var emailConfig = builder.Configuration
    .GetSection("EmailConfiguration")
    .Get<EmailConfiguration>();
builder.Services.AddSingleton(emailConfig);

var jwtConfig = builder.Configuration
    .GetSection("Jwt")
    .Get<JWTConfiguration>();
builder.Services.AddSingleton(jwtConfig);

builder.Services.AddControllers();
builder.Services.AddScoped<IAccountRecovery, AccountRecoveryService>();
builder.Services.AddScoped<IAuth, AuthRepository>();
builder.Services.AddScoped<IConfirmEmail, ConfirmEmailRepository>();
builder.Services.AddScoped<IJwt, JwtService>();
builder.Services.AddScoped<IPasswordRecovery, PasswordRecoveryService>();
builder.Services.AddScoped<IRole, RoleRepository>();
builder.Services.AddScoped<IGender, GenderRepository>();
builder.Services.AddScoped<ISaveImg, SaveImgService>();
builder.Services.AddScoped<ISendEmail, SendEmailService>();
builder.Services.AddScoped<IUser, UserRepository>();
builder.Services.AddScoped<ISort, SortRepository>();
builder.Services.AddScoped<ISearch, SearchRepository>();

var app = builder.Build();
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
}

app.UseCors(options => options
   .WithOrigins(new[] { "http://localhost:3000", "http://localhost:8080", "http://localhost:4200" })
   .AllowAnyHeader()
   .AllowAnyMethod()
);

app.UseHttpsRedirection();
app.UseDefaultFiles();
app.UseStaticFiles();

app.UseRouting();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

//initial Db
/*using (var scope = app.Services.CreateAsyncScope())
{
    UserDBContext dBContext = scope.ServiceProvider.GetRequiredService<UserDBContext>();
    await DbObjectUserManager.InitialRole(dBContext);
    await DbObjectUserManager.InitialGender(dBContext);
    await DbObjectUserManager.InitialAdmin(dBContext);
}*/

app.Run();
