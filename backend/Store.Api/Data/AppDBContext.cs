using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Store.Data.Models;

namespace Store.Api.Data
{
    public class AppDBContext : DbContext
    {
        public AppDBContext(DbContextOptions<AppDBContext> options) :
            base(options)
        {
        }

        public DbSet<ProductModel> Product { get; set; }
        public DbSet<CategoryModel> Category { get; set; }
        public DbSet<ProductInfoModel> ProductInfo { get; set; }
        public DbSet<CartModel> Cart { get; set; }
        public DbSet<BrandModel> Brand { get; set; }
        public DbSet<TypeModel> Type { get; set; }
        public DbSet<OrderModel> Order { get; set; }
        public DbSet<PaymentMethodModel> PaymentMethod { get; set; }
        public DbSet<CategoriesBrandsModel> CategoriesBrands { get; set; }
    }
}
