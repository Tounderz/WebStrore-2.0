using System;
using Microsoft.EntityFrameworkCore;
using Store.Api.Data;
using Store.Api.Data.Abstract;
using Store.Api.Data.Implementation;
using Store.Data.Models.Configurations;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors();
builder.Services.AddDbContext<AppDBContext>(options => options.UseSqlServer(builder.Configuration.GetConnectionString("Default")));
builder.Services.AddAuthorization();

var emailConfig = builder.Configuration
    .GetSection("EmailConfiguration")
    .Get<EmailConfiguration>();
builder.Services.AddSingleton(emailConfig);

builder.Services.AddControllers();

builder.Services.AddScoped<ICUDProduct, CUDProductRepository>();
builder.Services.AddScoped<IGetProduct, GetProductRegository>();
builder.Services.AddScoped<ICategory, CategoryRepository>();
builder.Services.AddScoped<IProductInfo, ProductInfoRepository>();
builder.Services.AddScoped<ICart, CartRepository>();
builder.Services.AddScoped<IBrand, BrandRepository>();
builder.Services.AddScoped<IType, TypeRepository>();
builder.Services.AddScoped<IOrder, OrderRepository>();
builder.Services.AddScoped<IPaymentMethod, PaymentMethodRepository>();
builder.Services.AddScoped<ICategoriesBrands, CategoriesBrandsRepository>();
builder.Services.AddScoped<ISearch, SearchRepository>();
builder.Services.AddScoped<ISort, SortRepository>();
builder.Services.AddScoped<ISaveImg, SaveImgService>();
builder.Services.AddScoped<ISendEmail, SendEmailService>();

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
    AppDBContext dBContext = scope.ServiceProvider.GetRequiredService<AppDBContext>();
    await DBObjects.InitialCategories(dBContext);
    await DBObjects.InitialBrands(dBContext);
    await DBObjects.InitialCategoriesBrands(dBContext);
    await DBObjects.InitialTypes(dBContext);
    await DBObjects.InitialProducts(dBContext);
    await DBObjects.InitialProductInfo(dBContext);
    await DBObjects.InitialPaymentMethod(dBContext);
}*/

app.Run();