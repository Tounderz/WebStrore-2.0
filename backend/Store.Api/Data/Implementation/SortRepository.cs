using System;
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
    public class SortRepository : ISort
    {
        private readonly AppDBContext _dbContext;
        public SortRepository(AppDBContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<(int countPages, List<ProductTableModel> products)> SortProduct(string propertyTitle, string typeSort, int currentPage)
        {
            var productsDb = await _dbContext.Product
                .Include(i => i.Category)
                .Include(i => i.Brand)
                .Include(i => i.Type)
                .ToListAsync();
            if (productsDb == null || productsDb.Count < 1)
            {
                return (0, null);
            }

            var products = productsDb.Select(item => new ProductTableModel
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

            switch (propertyTitle)
            {
                case ConstPropertyName.ID:
                    products = typeSort.Equals("down", StringComparison.OrdinalIgnoreCase)
                                ? products.OrderByDescending(i => i.Id).ToList()
                                : products.OrderBy(i => i.Id).ToList();
                    break;
                case ConstPropertyName.BRAND:
                    products = typeSort.Equals("down", StringComparison.OrdinalIgnoreCase)
                                ? products.OrderByDescending(i => i.BrandName).ToList()
                                : products.OrderBy(i => i.BrandName).ToList();
                    break;
                case ConstPropertyName.CATEGORY:
                    products = typeSort.Equals("down", StringComparison.OrdinalIgnoreCase)
                                ? products.OrderByDescending(i => i.CategoryName).ToList()
                                : products.OrderBy(i => i.CategoryName).ToList();
                    break;
                case ConstPropertyName.TYPE:
                    products = typeSort.Equals("down", StringComparison.OrdinalIgnoreCase)
                                ? products.OrderByDescending(i => i.TypeName).ToList()
                                : products.OrderBy(i => i.TypeName).ToList();
                    break;
                case ConstPropertyName.NAME:
                    products = typeSort.Equals("down", StringComparison.OrdinalIgnoreCase)
                                ? products.OrderByDescending(i => i.Name).ToList()
                                : products.OrderBy(i => i.Name).ToList();
                    break;
                case ConstPropertyName.PRICE:
                    products = typeSort.Equals("down", StringComparison.OrdinalIgnoreCase)
                                ? products.OrderByDescending(i => i.Price).ToList()
                                : products.OrderBy(i => i.Price).ToList();
                    break;
                case ConstPropertyName.AVAILABLE:
                    products = typeSort.Equals("down", StringComparison.OrdinalIgnoreCase)
                                ? products.OrderByDescending(i => i.Available).ToList()
                                : products.OrderBy(i => i.Available).ToList();
                    break;
                case ConstPropertyName.COUNT_VIEW:
                    products = typeSort.Equals("down", StringComparison.OrdinalIgnoreCase)
                                ? products.OrderByDescending(i => i.CountView).ToList()
                                : products.OrderBy(i => i.CountView).ToList();
                    break;
                default:
                    break;
            }

            var countPages = (int)Math.Ceiling(products.Count / (double)ConstParameters.LIMIT_TABLE_ONE_PAGE);
            var start = ConstParameters.LIMIT_TABLE_ONE_PAGE * (currentPage - 1);
            products = products.Skip(start).Take(ConstParameters.LIMIT_TABLE_ONE_PAGE).ToList();

            return (countPages, products);
        }

        public async Task<(int countPages, List<CategoryModel> categories)> SortCategory(string propertyTitle, string typeSort, int currentPage)
        {
            var categories = await _dbContext.Category.ToListAsync();
            if (categories == null || categories.Count == 0)
            {
                return (0, null);
            }

            switch (propertyTitle)
            {
                case ConstPropertyName.ID:
                    categories = typeSort.Equals("down", StringComparison.OrdinalIgnoreCase)
                        ? categories.OrderByDescending(i => i.Id).ToList()
                        : categories.OrderBy(i => i.Id).ToList();
                    break;
                case ConstPropertyName.NAME:
                    categories = typeSort.Equals("down", StringComparison.OrdinalIgnoreCase)
                        ? categories.OrderByDescending(i => i.Name).ToList()
                        : categories.OrderBy(i => i.Name).ToList();
                    break;
                case ConstPropertyName.COUNT_VIEW:
                    categories = typeSort.Equals("down", StringComparison.OrdinalIgnoreCase)
                        ? categories.OrderByDescending(i => i.CountView).ToList()
                        : categories.OrderBy(i => i.CountView).ToList();
                    break;
                default:
                    break;
            }

            var countPages = (int)Math.Ceiling(categories.Count / (double)ConstParameters.LIMIT_TABLE_ONE_PAGE);
            var start = ConstParameters.LIMIT_TABLE_ONE_PAGE * (currentPage - 1);
            categories = categories.Skip(start).Take(ConstParameters.LIMIT_TABLE_ONE_PAGE).ToList();

            return (countPages, categories);
        }

        public async Task<(int countPages, List<BrandModel> brands)> SortBrand(string propertyTitle, string typeSort, int currentPage)
        {
            var brands = await _dbContext.Brand.ToListAsync();
            if (brands == null || brands.Count == 0)
            {
                return (0, null);
            }

            switch (propertyTitle)
            {
                case ConstPropertyName.ID:
                    brands = typeSort.Equals("down", StringComparison.OrdinalIgnoreCase)
                        ? brands.OrderByDescending(i => i.Id).ToList()
                        : brands.OrderBy(i => i.Id).ToList();
                    break;
                case ConstPropertyName.NAME:
                    brands = typeSort.Equals("down", StringComparison.OrdinalIgnoreCase)
                        ? brands.OrderByDescending(i => i.Name).ToList()
                        : brands.OrderBy(i => i.Name).ToList();
                    break;
                case ConstPropertyName.COUNT_VIEW:
                    brands = typeSort.Equals("down", StringComparison.OrdinalIgnoreCase)
                        ? brands.OrderByDescending(i => i.CountView).ToList()
                        : brands.OrderBy(i => i.CountView).ToList();
                    break;
                default:
                    break;
            }

            var countPages = (int)Math.Ceiling(brands.Count / (double)ConstParameters.LIMIT_TABLE_ONE_PAGE);
            var start = ConstParameters.LIMIT_TABLE_ONE_PAGE * (currentPage - 1);
            brands = brands.Skip(start).Take(ConstParameters.LIMIT_TABLE_ONE_PAGE).ToList();

            return (countPages, brands);
        }

        public async Task<(int countPages, List<TypeModel> types)> SortType(string propertyTitle, string typeSort, int currentPage)
        {
            var types = await _dbContext.Type
                .Include(i => i.Category)
                .ToListAsync();

            if (types == null || types.Count == 0)
            {
                return (0, null);
            }

            switch (propertyTitle)
            {
                case ConstPropertyName.ID:
                    types = typeSort.Equals("down", StringComparison.OrdinalIgnoreCase)
                        ? types.OrderByDescending(i => i.Id).ToList()
                        : types.OrderBy(i => i.Id).ToList();
                    break;
                case ConstPropertyName.CATEGORY:
                    types = typeSort.Equals("down", StringComparison.OrdinalIgnoreCase)
                                ? types.OrderByDescending(i => i.Category.Name).ToList()
                                : types.OrderBy(i => i.Category.Name).ToList();
                    break;
                case ConstPropertyName.NAME:
                    types = typeSort.Equals("down", StringComparison.OrdinalIgnoreCase)
                        ? types.OrderByDescending(i => i.Name).ToList()
                        : types.OrderBy(i => i.Name).ToList();
                    break;
                default:
                    break;
            }

            var countPages = (int)Math.Ceiling(types.Count / (double)ConstParameters.LIMIT_TABLE_ONE_PAGE);
            var start = ConstParameters.LIMIT_TABLE_ONE_PAGE * (currentPage - 1);
            types = types.Skip(start).Take(ConstParameters.LIMIT_TABLE_ONE_PAGE).ToList();

            return (countPages, types);
        }

        public async Task<(int countPages, List<PaymentMethodModel> paymentMethods)> SortPaymentMethod(string propertyTitle, string typeSort, int currentPage)
        {
            var paymentMethods = await _dbContext.PaymentMethod.ToListAsync();
            if (paymentMethods == null || paymentMethods.Count == 0)
            {
                return (0, null);
            }

            switch (propertyTitle)
            {
                case ConstPropertyName.ID:
                    paymentMethods = typeSort.Equals("down", StringComparison.OrdinalIgnoreCase)
                        ? paymentMethods.OrderByDescending(i => i.Id).ToList()
                        : paymentMethods.OrderBy(i => i.Id).ToList();
                    break;
                case ConstPropertyName.NAME:
                    paymentMethods = typeSort.Equals("down", StringComparison.OrdinalIgnoreCase)
                        ? paymentMethods.OrderByDescending(i => i.Name).ToList()
                        : paymentMethods.OrderBy(i => i.Name).ToList();
                    break;
                default:
                    break;
            }

            var countPages = (int)Math.Ceiling(paymentMethods.Count / (double)ConstParameters.LIMIT_TABLE_ONE_PAGE);
            var start = ConstParameters.LIMIT_TABLE_ONE_PAGE * (currentPage - 1);
            paymentMethods = paymentMethods.Skip(start).Take(ConstParameters.LIMIT_TABLE_ONE_PAGE).ToList();

            return (countPages, paymentMethods);
        }
    }
}
