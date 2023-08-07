using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System;
using Store.Data.Constants;
using Store.Api.Data;
using Store.Data.Models;
using Store.Api.Data.Abstract;

#pragma warning disable CS8603
#pragma warning disable CS8619

namespace Store.Api.Data.Implementation
{
    public class GetProductRegository : IGetProduct
    {
        private readonly AppDBContext _dbContext;

        public GetProductRegository(AppDBContext context)
        {
            _dbContext = context;
        }

        public async Task<ProductModel> GetProductById(int id)
        {
            var product = await _dbContext.Product.FirstOrDefaultAsync(i => i.Id == id);
            if (product == null)
            {
                return null;
            }

            return product;
        }

        public async Task<List<ProductModel>> GetProductsPopular(int count)
        {
            var products = await _dbContext.Product.ToListAsync();
            if (products == null || products.Count < 1)
            {
                return null;
            }

            products = count > products.Count ? products.OrderByDescending(i => i.CountView).Take(count).ToList() : products;

            return products;
        }

        public async Task<List<ProductModel>> GetProductsBrand(int brandId)
        {
            var products = await _dbContext.Product.Where(i => i.BrandId == brandId).ToListAsync();
            if (products == null || products.Count < 1)
            {
                return null;
            }

            return products;
        }

        public async Task<List<ProductModel>> GetProductsCategory(int categoruId)
        {
            var products = await _dbContext.Product.Where(i => i.CategoryId == categoruId).ToListAsync();
            if (products == null || products.Count < 1)
            {
                return null;
            }

            return products;
        }

        public async Task<List<ProductModel>> GetProductsType(int typeId)
        {
            var products = await _dbContext.Product.Where(i => i.TypeId == typeId).ToListAsync();
            if (products == null || products.Count < 1)
            {
                return null;
            }

            return products;
        }

        public async Task<(int countPages, List<ProductTableModel> products)> GetProductsTable(int currentPage)
        {
            var products = await _dbContext.Product
                .Include(i => i.Category)
                .Include(i => i.Brand)
                .Include(i => i.Type)
                .ToListAsync();

            if (products == null || !products.Any())
            {
                return (0, null);
            }

            var productsTable = products.Select(item => new ProductTableModel
            {
                Id = item.Id,
                Name = item.Name,
                CategoryName = item.Category.Name,
                BrandName = item.Brand.Name,
                TypeName = item.Type.Name,
                ShortDescription = string.IsNullOrEmpty(item.ShortDescription) ? string.Empty : item.ShortDescription,
                Available = item.Available.ToString(),
                CountView = item.CountView,
                Price = item.Price
            }).ToList();

            var countPages = (int)Math.Ceiling(products.Count / (double)ConstParameters.LIMIT_TABLE_ONE_PAGE);
            var start = ConstParameters.LIMIT_TABLE_ONE_PAGE * (currentPage - 1);
            productsTable = productsTable.Skip(start).Take(ConstParameters.LIMIT_TABLE_ONE_PAGE).ToList();

            return (countPages, productsTable);
        }

        public async Task<(int countPages, List<ProductModel> products)> GetProductsByBrandId(int currentPage, int brandId, List<int> categoriesId)
        {
            var query = brandId > 0 ?
                _dbContext.Product.AsQueryable().Where(i => i.BrandId == brandId) :
                _dbContext.Product.AsQueryable();

            if (categoriesId != null && categoriesId.Count > 0)
            {
                query = query.Where(i => categoriesId.Contains(i.CategoryId));
            }

            if (query == null || query.Count() < 1)
            {
                return (0, null);
            }

            var (countPages, products) = await GetPaginatedProducts(query, currentPage);

            return (countPages, products);
        }

        public async Task<(int countPages, List<ProductModel> products)> GetProductsByCategoryId(int currentPage, int categoryId, List<int> brandsId)
        {
            var query = categoryId > 0 ?
                _dbContext.Product.AsQueryable().Where(i => i.CategoryId == categoryId) :
                _dbContext.Product.AsQueryable();

            if (brandsId != null && brandsId.Count > 0)
            {
                query = query.Where(i => brandsId.Contains(i.BrandId));
            }

            if (query == null || query.Count() < 1)
            {
                return (0, null);
            }

            var (countPages, products) = await GetPaginatedProducts(query, currentPage);

            return (countPages, products);
        }

        public async Task<(int countPages, List<ProductModel> products)> GetProductsBrandsByType(int currentPage, int typeId, List<int> brandsId)
        {
            var query = typeId > 0 ?
                _dbContext.Product.AsQueryable().Where(i => i.TypeId == typeId) :
                _dbContext.Product.AsQueryable();

            if (brandsId != null && brandsId.Count > 0)
            {
                query = query.Where(i => brandsId.Contains(i.BrandId));
            }


            if (query == null || query.Count() < 1)
            {
                return (0, null);
            }

            var (countPages, products) = await GetPaginatedProducts(query, currentPage);
            return (countPages, products);
        }

        private async Task<(int countPages, List<ProductModel> products)> GetPaginatedProducts(IQueryable<ProductModel> query, int currentPage)
        {
            var products = await query.OrderBy(i => i.Id).ToListAsync();
            var countPages = (int)Math.Ceiling(products.Count / (double)ConstParameters.LIMIT_TABLE_ONE_PAGE);
            var start = ConstParameters.LIMIT_TABLE_ONE_PAGE * (currentPage - 1);
            products = products.Skip(start).Take(ConstParameters.LIMIT_TABLE_ONE_PAGE).ToList();

            return (countPages, products);
        }
    }
}
