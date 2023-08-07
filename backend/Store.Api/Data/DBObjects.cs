using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Store.Data.Models;

namespace Store.Api.Data
{
    public class DBObjects
    {
        public async static Task InitialCategories(AppDBContext context)
        {
            if(!context.Category.Any())
            {
                var categories = new List<CategoryModel>
                {
                    new CategoryModel
                    {
                        Name = "Cars",
                        Img = "/img/Cars.jpg",
                        ShortDescription = "In this category, you will pick up a car for yourself.",
                        Info = string.Empty,
                        CountView = 0
                    },
                    new CategoryModel
                    {
                        Name = "Mobile Phones",
                        Img = "/img/Phone.jpg",
                        ShortDescription = "In this category, you will pick up a mobile phone to your taste and for your needs.",
                        Info = string.Empty,
                        CountView = 0
                    },
                    new CategoryModel
                    {
                        Name = "Laptops",
                        Img = "/img/Laptop.jpg",
                        ShortDescription = "In this category, you will pick up a laptop to your taste and for your needs.",
                        Info = string.Empty,
                        CountView = 0
                    },
                    new CategoryModel
                    {
                        Name = "PC",
                        Img = "/img/Pc.jpg",
                        ShortDescription = "Category of PC",
                        Info = string.Empty,
                        CountView = 0
                    }
                };

                await context.Category.AddRangeAsync(categories);
                await context.SaveChangesAsync();
            }
        }

        public async static Task InitialBrands(AppDBContext context)
        {
            if(!context.Brand.Any())
            {
                 var brands = new List<BrandModel>
                 {
                     new BrandModel {
                        Name = "Tesla",
                        Img = "/img/4e1687d3-bc72-4782-bbee-c104e861fd7fteslaLogo.jpg",
                        Info = string.Empty,
                        CountView = 0
                     },
                     new BrandModel {
                        Name = "Ford",
                        Img = "/img/785e4fa1-03f9-42ed-bf58-3a04d02548cbfordLogo.jpg",
                        Info = string.Empty,
                        CountView = 0
                     },
                     new BrandModel {
                        Name = "BMW",
                        Img = "/img/ee35d790-9629-47ec-baa6-677be25169bfbmwLogo.jpg",
                        Info = string.Empty,
                        CountView = 0
                     },
                     new BrandModel {
                        Name = "Mercedes",
                        Img = "/img/14e63c4f-6af8-4c56-98e4-f1ced6e6f0a5mercedes.jpg",
                        Info = string.Empty,
                        CountView = 0
                     },
                     new BrandModel {
                        Name = "Nissan",
                        Img = "/img/5102a7db-a123-4a37-8440-141a12c9122bnissan-foto-15.jpg",
                        Info = string.Empty,
                        CountView = 0
                     },
                     new BrandModel {
                        Name = "Apple",
                        Img = "/img/9acebdc6-126a-4e5b-857e-fcf777e50dd4apple-logo.jpg",
                        Info = string.Empty,
                        CountView = 0
                     },
                     new BrandModel {
                        Name = "HP",
                        Img = "/img/d5ef4ebe-999d-4d71-b7fe-467904259e6dhpLogo.jpg",
                        Info = string.Empty,
                        CountView = 0
                     }
                 };

                await context.Brand.AddRangeAsync(brands);
                await context.SaveChangesAsync();
            }
        }

        public async static Task InitialCategoriesBrands(AppDBContext context)
        {
            if (!context.CategoriesBrands.Any())
            {
                var categoriesBrands = new List<CategoriesBrandsModel>
                {
                    new CategoriesBrandsModel
                    {
                        BrandId = context.Brand.FirstOrDefault(i => i.Name == "Tesla").Id,
                        CategoryId = context.Category.FirstOrDefault(i => i.Name == "Cars" ).Id,
                    },
                    new CategoriesBrandsModel
                    {
                        BrandId = context.Brand.FirstOrDefault(i => i.Name == "Ford" ).Id,
                        CategoryId = context.Category.FirstOrDefault(i => i.Name == "Cars" ).Id,
                    },
                    new CategoriesBrandsModel
                    {
                        BrandId = context.Brand.FirstOrDefault(i => i.Name == "BMW").Id,
                        CategoryId = context.Category.FirstOrDefault(i => i.Name == "Cars").Id,
                    },
                    new CategoriesBrandsModel
                    {
                        BrandId = context.Brand.FirstOrDefault(i => i.Name == "Mercedes").Id,
                        CategoryId = context.Category.FirstOrDefault(i => i.Name == "Cars").Id,
                    },
                    new CategoriesBrandsModel
                    {
                        BrandId = context.Brand.FirstOrDefault(i => i.Name == "Nissan").Id,
                        CategoryId = context.Category.FirstOrDefault(i => i.Name == "Cars").Id,
                    },
                    new CategoriesBrandsModel
                    {
                        BrandId = context.Brand.FirstOrDefault(i => i.Name == "Apple").Id,
                        CategoryId = context.Category.FirstOrDefault(i => i.Name == "Mobile Phones").Id,
                    },
                    new CategoriesBrandsModel
                    {
                        BrandId = context.Brand.FirstOrDefault(i => i.Name == "Apple").Id,
                        CategoryId = context.Category.FirstOrDefault(i => i.Name == "Laptops").Id,
                    },
                    new CategoriesBrandsModel
                    {
                        BrandId = context.Brand.FirstOrDefault(i => i.Name == "HP").Id,
                        CategoryId = context.Category.FirstOrDefault(i => i.Name == "Laptops").Id,
                    },
                    new CategoriesBrandsModel
                    {
                        BrandId = context.Brand.FirstOrDefault(i => i.Name == "HP").Id,
                        CategoryId =  context.Category.FirstOrDefault(i => i.Name == "PC").Id,
                    },
                    new CategoriesBrandsModel
                    {
                        BrandId = context.Brand.FirstOrDefault(i => i.Name == "Apple").Id,
                        CategoryId = context.Category.FirstOrDefault(i => i.Name == "PC").Id,
                    }
                    
                };

                await context.CategoriesBrands.AddRangeAsync(categoriesBrands);
                await context.SaveChangesAsync();
            }
        }

        public async static Task InitialTypes(AppDBContext context)
        {
            if (!context.Type.Any())
            {
                var types = new List<TypeModel>
                {
                    new TypeModel { CategoryId = context.Category.FirstOrDefault(i => i.Name == "Cars" ).Id, Name = "ElictricCars" },
                    new TypeModel { CategoryId = context.Category.FirstOrDefault(i => i.Name == "Cars" ).Id, Name = "Classics cars" },
                    new TypeModel { CategoryId = context.Category.FirstOrDefault(i => i.Name == "Mobile Phones").Id, Name = "IOS" },
                    new TypeModel { CategoryId = context.Category.FirstOrDefault(i => i.Name == "Mobile Phones").Id, Name = "Android" },
                    new TypeModel { CategoryId = context.Category.FirstOrDefault(i => i.Name == "Laptops").Id, Name = "Gaming" },
                    new TypeModel { CategoryId = context.Category.FirstOrDefault(i => i.Name == "Laptops").Id, Name = "Ultrabook" }
                };

                await context.Type.AddRangeAsync(types);
                await context.SaveChangesAsync();
            }
            
        }

        public async static Task InitialProducts(AppDBContext context)
        {
            if(!context.Product.Any())
            {
                var products = new List<ProductModel>
                {
                    new ProductModel
                        {
                            CategoryId = context.Category.FirstOrDefault(i => i.Name == "Cars" ).Id,
                            TypeId = context.Type.FirstOrDefault(i => i.Name == "ElictricCars" ).Id,
                            BrandId = context.Brand.FirstOrDefault(i => i.Name == "Tesla" ).Id,
                            Name = "Model S",
                            ShortDescription = "Fast car from Tesla",
                            Img = "/img/Tesla.jpg",
                            Price = 45000,
                            IsFavourite = true,
                            Available = true,
                            CountView = 0
                        },
                    new ProductModel
                        {
                            CategoryId = context.Category.FirstOrDefault(i => i.Name == "Cars" ).Id,
                            TypeId = context.Type.FirstOrDefault(i => i.Name == "Classics cars" ).Id,
                            BrandId = context.Brand.FirstOrDefault(i => i.Name == "Ford" ).Id,
                            Name = "Fiesta",
                            ShortDescription = "Quiet and calm",
                            Img = "/img/Ford.jpg",
                            Price = 11000,
                            IsFavourite = false,
                            Available = true,
                            CountView = 0
                         },
                    new ProductModel
                        {
                            CategoryId = context.Category.FirstOrDefault(i => i.Name == "Cars" ).Id,
                            TypeId = context.Type.FirstOrDefault(i => i.Name == "Classics cars" ).Id,
                            BrandId = context.Brand.FirstOrDefault(i => i.Name == "BMW" ).Id,
                            Name = "M3",
                            ShortDescription = "Bold and stylish",
                            Img = "/img/BMW.jpg",
                            Price = 65000,
                            IsFavourite = true,
                            Available = true,
                            CountView = 0
                        },
                    new ProductModel
                        {
                            CategoryId = context.Category.FirstOrDefault(i => i.Name == "Cars" ).Id,
                            TypeId = context.Type.FirstOrDefault(i => i.Name == "Classics cars" ).Id,
                            BrandId = context.Brand.FirstOrDefault(i => i.Name == "Mercedes" ).Id,
                            Name = "C class",
                            ShortDescription = "Cozy and large",
                            Img = "/img/Mercedes.jpg",
                            Price = 40000,
                            IsFavourite = false,
                            Available = false,
                            CountView = 0
                        },
                    new ProductModel
                        {
                            CategoryId = context.Category.FirstOrDefault(i => i.Name == "Cars" ).Id,
                            TypeId = context.Type.FirstOrDefault(i => i.Name == "ElictricCars" ).Id,
                            BrandId = context.Brand.FirstOrDefault(i => i.Name == "Nissan" ).Id,
                            Name = "Leaf",
                            ShortDescription = "Silent and economical",
                            Img = "/img/Nissan.jpg",
                            Price = 14000,
                            IsFavourite = true,
                            Available = true,
                            CountView = 0
                        },
                    new ProductModel
                        {
                            CategoryId = context.Category.FirstOrDefault(i => i.Name == "Mobile Phones" ).Id,
                            TypeId = context.Type.FirstOrDefault(i => i.Name == "IOS" ).Id,
                            BrandId = context.Brand.FirstOrDefault(i => i.Name == "Apple" ).Id,
                            Name = "IPhone 13 Pro Max",
                            ShortDescription = "Apple's flagship",
                            Img = "/img/iphone13proMax.jpg",
                            Price = 1800,
                            IsFavourite = true,
                            Available = true,
                            CountView = 0
                        },
                    new ProductModel
                    {
                        CategoryId = context.Category.FirstOrDefault(i => i.Name == "Laptops" ).Id,
                        TypeId = context.Type.FirstOrDefault(i => i.Name == "Gaming" ).Id,
                        BrandId = context.Brand.FirstOrDefault(i => i.Name == "HP" ).Id,
                        Name = "OMEN",
                        ShortDescription = "Gaming laptop",
                        Img = "/img/HP.jpg",
                        Price = 2300,
                        IsFavourite = true,
                        Available = true,
                        CountView = 0
                    },
                    new ProductModel
                    {
                        CategoryId = context.Category.FirstOrDefault(i => i.Name == "Laptops" ).Id,
                        TypeId = context.Type.FirstOrDefault(i => i.Name == "Ultrabook" ).Id,
                        BrandId = context.Brand.FirstOrDefault(i => i.Name == "Apple" ).Id,
                        Name = "Macbook Pro 16 M1 Max 2021",
                        ShortDescription = "Ultrabook, for programming, for designer, for photographer",
                        Img = "/img/mac2021.jpg",
                        Price = 8600,
                        IsFavourite = true,
                        Available = true,
                        CountView = 0
                    }
                };

                await context.Product.AddRangeAsync(products);
                await context.SaveChangesAsync();
            }
        }

        public async static Task InitialProductInfo(AppDBContext context)
        {
            if (!context.ProductInfo.Any())
            {
                var productInfos = new List<ProductInfoModel>
                {
                    new ProductInfoModel 
                    { 
                        ProductId = context.Product.FirstOrDefault(i => i.Name == "Model S" ).Id, 
                        Title = "Range (EPA est.)",
                        Description = "396 mi" 
                    },
                    new ProductInfoModel 
                    { 
                        ProductId = context.Product.FirstOrDefault(i => i.Name == "Model S" ).Id, 
                        Title = "0-60 mph*", 
                        Description = "1.99 s" 
                    },
                    new ProductInfoModel
                    { 
                        ProductId = context.Product.FirstOrDefault(i => i.Name == "Model S").Id, 
                        Title = "Top Speed", 
                        Description = "200 mph" 
                    },
                    new ProductInfoModel 
                    { 
                        ProductId = context.Product.FirstOrDefault(i => i.Name == "Model S").Id, 
                        Title = "Peak Power", 
                        Description = "1,020 hp"
                    },
                    new ProductInfoModel 
                    { 
                        ProductId = context.Product.FirstOrDefault(i => i.Name == "IPhone 13 Pro Max").Id, 
                        Title = "Screen diagonal", 
                        Description = "6.7”"
                    },
                    new ProductInfoModel 
                    { 
                        ProductId = context.Product.FirstOrDefault(i => i.Name == "IPhone 13 Pro Max").Id, 
                        Title = "Processor", 
                        Description = "A15 Bionic"
                    },
                    new ProductInfoModel 
                    { 
                        ProductId = context.Product.FirstOrDefault(i => i.Name == "IPhone 13 Pro Max").Id, 
                        Title = "Case Material", 
                        Description = "Metal/Glass"
                    },
                    new ProductInfoModel 
                    { 
                        ProductId = context.Product.FirstOrDefault(i => i.Name == "IPhone 13 Pro Max").Id, 
                        Title = "Screen diagonal", 
                        Description = "6.7”"
                    },
                    new ProductInfoModel 
                    { 
                        ProductId = context.Product.FirstOrDefault(i => i.Name == "OMEN").Id, 
                        Title = "Processor", 
                        Description = "AMD Ryzen 7 5800H"
                    },
                    new ProductInfoModel 
                    { 
                        ProductId = context.Product.FirstOrDefault(i => i.Name == "OMEN").Id, 
                        Title = "Processor frequency", 
                        Description = "3,200 MHz - 4400MHz"
                    },
                    new ProductInfoModel 
                    { 
                        ProductId = context.Product.FirstOrDefault(i => i.Name == "OMEN").Id, 
                        Title = "Graphics built into the processor", 
                        Description = "AMD Radeon Vega 8"
                    },
                    new ProductInfoModel 
                    { 
                        ProductId = context.Product.FirstOrDefault(i => i.Name == "OMEN").Id, 
                        Title = "Matrix frequency", 
                        Description = "144 Hz"
                    },
                    new ProductInfoModel 
                    { 
                        ProductId = context.Product.FirstOrDefault(i => i.Name == "OMEN").Id, 
                        Title = "Discrete graphics",
                        Description = "NVIDIA GeForce RTX 3060 6 GB"
                    },
                    new ProductInfoModel 
                    { 
                        ProductId = context.Product.FirstOrDefault(i => i.Name == "Macbook Pro 16 M1 Max 2021").Id, 
                        Title = "Processor", 
                        Description = "Apple M1 Max"
                    },
                    new ProductInfoModel { 
                        ProductId = context.Product.FirstOrDefault(i => i.Name == "Macbook Pro 16 M1 Max 2021").Id, 
                        Title = "Matrix frequency", 
                        Description = "120 Hz"
                    },
                    new ProductInfoModel 
                    { 
                        ProductId = context.Product.FirstOrDefault(i => i.Name == "Macbook Pro 16 M1 Max 2021").Id, 
                        Title = "SSD", 
                        Description = "4096 Gb"
                    },
                    new ProductInfoModel 
                    { 
                        ProductId = context.Product.FirstOrDefault(i => i.Name == "Macbook Pro 16 M1 Max 2021").Id, 
                        Title = "Screen diagonal", 
                        Description = "16.2”"
                    },
                };

                await context.ProductInfo.AddRangeAsync(productInfos);
                await context.SaveChangesAsync();
            }
        }

        public async static Task InitialPaymentMethod(AppDBContext context)
        {
            if (!context.PaymentMethod.Any())
            {
                var paymentMethods = new List<PaymentMethodModel>
                {
                    new PaymentMethodModel { Name = "Cash" },
                    new PaymentMethodModel { Name = "Credit card" }

                };

                await context.PaymentMethod.AddRangeAsync(paymentMethods);
                await context.SaveChangesAsync();
            }
        }
    }
}
