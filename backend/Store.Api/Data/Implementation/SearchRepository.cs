using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Store.Api.Data;
using Store.Api.Data.Abstract;
using Store.Data.Constants;
using Store.Data.Models;

#pragma warning disable CS8619

namespace Store.Api.Data.Implementation
{
    public class SearchRepository : ISearch
    {
        private readonly AppDBContext _dbContext;

        public SearchRepository(AppDBContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<(int countPages, List<ProductModel> products)> ResaultSearch(string parameter, int currentPage)
        {
            var brandIds = await _dbContext.Brand
                .Where(i => i.Name.Contains(parameter))
                .Select(i => i.Id)
                .ToListAsync();

            var categoryIds = await _dbContext.Category
                .Where(i => i.Name.Contains(parameter))
                .Select(i => i.Id)
                .ToListAsync();

            var typeIds = await _dbContext.Type
                .Where(i => i.Name.Contains(parameter))
                .Select(i => i.Id)
                .ToListAsync();

            var productIds = await _dbContext.Product
                .Where(i => i.Name.Contains(parameter))
                .Select(i => i.Id)
                .ToListAsync();

            var products = await _dbContext.Product
                        .Where(i => brandIds.Contains(i.BrandId) ||
                                    categoryIds.Contains(i.CategoryId) ||
                                    typeIds.Contains(i.TypeId) ||
                                    productIds.Contains(i.Id))
                        .ToListAsync();

            if (products == null || products.Count < 1)
            {
                return (0, null);
            }

            products = products.Distinct().ToList();

            var countPages = (int)Math.Ceiling(products.Count / (double)ConstParameters.LIMIT_TABLE_ONE_PAGE);
            var start = ConstParameters.LIMIT_TABLE_ONE_PAGE * (currentPage - 1);
            products = products.Skip(start).Take(ConstParameters.LIMIT_TABLE_ONE_PAGE).ToList();

            return (countPages, products);
        }

        public async Task<(int countPages, List<ProductTableModel> products)> ResaultSearchProducts(string parameter, int currentPage, string criteria)
        {
            var query = _dbContext.Product.AsQueryable();

            switch (criteria)
            {
                case ConstPropertyName.ID:
                    query = query.Where(i => i.Id == int.Parse(parameter));
                    break;
                case ConstPropertyName.NAME:
                    query = query.Where(i => i.Name.Contains(parameter));
                    break;
                case ConstPropertyName.CATEGORY:
                    var categoryId = await _dbContext.Category
                        .FirstOrDefaultAsync(i => i.Name.Contains(parameter));

                    if (categoryId != null)
                    {
                        query = query.Where(i => i.CategoryId == categoryId.Id);
                    }
                    break;
                case ConstPropertyName.TYPE:
                    var typeId = await _dbContext.Type
                        .FirstOrDefaultAsync(i => i.Name.Contains(parameter));

                    if (typeId != null)
                    {
                        query = query.Where(i => i.TypeId == typeId.Id);
                    }
                    break;
                case ConstPropertyName.BRAND:
                    var brandId = await _dbContext.Brand
                        .FirstOrDefaultAsync(i => i.Name.Contains(parameter));

                    if (brandId != null)
                    {
                        query = query.Where(i => i.BrandId == brandId.Id);
                    }
                    break;
                case ConstPropertyName.PRICE:
                    query = query.Where(i => i.Price == int.Parse(parameter));
                    break;
                case ConstPropertyName.AVAILABLE:
                    query = query.Where(i => i.Available == bool.Parse(parameter));
                    break;
                case ConstPropertyName.COUNT_VIEW:
                    query = query.Where(i => i.CountView == int.Parse(parameter));
                    break;
                default:
                    break;
            }

            if (query == null || query.Count() < 1)
            {
                return (0, null);
            }

            var productsTable = await query.Select(item => new ProductTableModel
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
            }).ToListAsync();

            var countPages = (int)Math.Ceiling(productsTable.Count / (double)ConstParameters.LIMIT_TABLE_ONE_PAGE);
            var start = ConstParameters.LIMIT_TABLE_ONE_PAGE * (currentPage - 1);
            productsTable = productsTable.Skip(start).Take(ConstParameters.LIMIT_TABLE_ONE_PAGE).ToList();

            return (countPages, productsTable);
        }

        public async Task<(int countPages, List<CategoryModel> categories)> ResaultSearchCategories(string parameter, int currentPage, string criteria)
        {
            var query = _dbContext.Category.AsQueryable();

            switch (criteria)
            {
                case ConstPropertyName.ID:
                    query = query.Where(i => i.Id == int.Parse(parameter));
                    break;
                case ConstPropertyName.NAME:
                    query = query.Where(i => i.Name.Contains(parameter));
                    break;
                case ConstPropertyName.COUNT_VIEW:
                    query = query.Where(i => i.CountView == int.Parse(parameter));
                    break;
                default:
                    break;
            }

            if (query == null || query.Count() < 1)
            {
                return (0, null);
            }

            var countPages = (int)Math.Ceiling(query.Count() / (double)ConstParameters.LIMIT_TABLE_ONE_PAGE);
            var start = ConstParameters.LIMIT_TABLE_ONE_PAGE * (currentPage - 1);
            var categories = await query.Skip(start).Take(ConstParameters.LIMIT_TABLE_ONE_PAGE).ToListAsync();

            return (countPages, categories);
        }

        public async Task<(int countPages, List<BrandModel> brands)> ResaultSearchBrands(string parameter, int currentPage, string criteria)
        {
            var query = _dbContext.Brand.AsQueryable();

            switch (criteria)
            {
                case ConstPropertyName.ID:
                    query = query.Where(i => i.Id == int.Parse(parameter));
                    break;
                case ConstPropertyName.NAME:
                    query = query.Where(i => i.Name.Contains(parameter));
                    break;
                case ConstPropertyName.COUNT_VIEW:
                    query = query.Where(i => i.CountView == int.Parse(parameter));
                    break;
                default:
                    break;
            }

            if (query == null || query.Count() < 1)
            {
                return (0, null);
            }

            var countPages = (int)Math.Ceiling(query.Count() / (double)ConstParameters.LIMIT_TABLE_ONE_PAGE);
            var start = ConstParameters.LIMIT_TABLE_ONE_PAGE * (currentPage - 1);
            var brands = await query.Skip(start).Take(ConstParameters.LIMIT_TABLE_ONE_PAGE).ToListAsync();

            return (countPages, brands);
        }

        public async Task<(int countPages, List<TypeModel> types)> ResaultSearchTypes(string parameter, int currentPage, string criteria)
        {
            var query = _dbContext.Type.AsQueryable();

            switch (criteria)
            {
                case ConstPropertyName.ID:
                    query = query.Where(i => i.Id == int.Parse(parameter));
                    break;
                case ConstPropertyName.CATEGORY:
                    var categoryId = await _dbContext.Category
                        .FirstOrDefaultAsync(i => i.Name.Contains(parameter));

                    if (categoryId != null)
                    {
                        query = query.Where(i => i.CategoryId == categoryId.Id);
                    }
                    break;
                case ConstPropertyName.NAME:
                    query = query.Where(i => i.Name.Contains(parameter));
                    break;
                default:
                    break;
            }

            if (query == null || query.Count() < 1)
            {
                return (0, null);
            }

            var countPages = (int)Math.Ceiling(query.Count() / (double)ConstParameters.LIMIT_TABLE_ONE_PAGE);
            var start = ConstParameters.LIMIT_TABLE_ONE_PAGE * (currentPage - 1);
            var types = await query.Skip(start).Take(ConstParameters.LIMIT_TABLE_ONE_PAGE).ToListAsync();

            return (countPages, types);
        }

        public async Task<(int countPages, List<PaymentMethodModel> paymentMethods)> ResaultSearchPaymentMethod(string parameter, int currentPage, string criteria)
        {
            var query = _dbContext.PaymentMethod.AsQueryable();

            switch (criteria)
            {
                case ConstPropertyName.ID:
                    query = query.Where(i => i.Id == int.Parse(parameter));
                    break;
                case ConstPropertyName.NAME:
                    query = query.Where(i => i.Name.Contains(parameter));
                    break;
                default:
                    break;
            }

            if (query == null || query.Count() < 1)
            {
                return (0, null);
            }

            var countPages = (int)Math.Ceiling(query.Count() / (double)ConstParameters.LIMIT_TABLE_ONE_PAGE);
            var start = ConstParameters.LIMIT_TABLE_ONE_PAGE * (currentPage - 1);
            var brands = await query.Skip(start).Take(ConstParameters.LIMIT_TABLE_ONE_PAGE).ToListAsync();

            return (countPages, brands);
        }
    }
}
