using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Store.Api.Data;
using Store.Api.Data.Abstract;
using Store.Data.Models;
using Store.Data.Models.Dtos;

#pragma warning disable CS8602
#pragma warning disable CS8603

namespace Store.Api.Data.Implementation
{
    public class CategoriesBrandsRepository : ICategoriesBrands
    {
        private readonly AppDBContext _dbContext;

        public CategoriesBrandsRepository(AppDBContext context)
        {
            _dbContext = context;
        }

        public async Task<StatusModel> CreateCategoriesByBrand(BrandDto model)
        {
            var status = new StatusModel();
            var categoriesByBrand = await AddCategoriesDbByBrand(model);
            if (categoriesByBrand == null)
            {
                status.StatusCode = 0;
                status.StatusMessage = "Failed to create categories for the brand.";
                return status;
            }

            await _dbContext.CategoriesBrands.AddRangeAsync(categoriesByBrand);
            await _dbContext.SaveChangesAsync();

            status.StatusCode = 1;
            status.StatusMessage = "Categories created successfully for the brand.";
            return status;
        }

        public async Task<StatusModel> CreateBrandsByCategory(CategoryDto model)
        {
            var status = new StatusModel();
            var brandsByCategory = await AddBrandsDbByCategory(model);
            if (brandsByCategory == null)
            {
                status.StatusCode = 0;
                status.StatusMessage = "Failed to create brands for the category.";
                return status;
            }

            await _dbContext.CategoriesBrands.AddRangeAsync(brandsByCategory);
            await _dbContext.SaveChangesAsync();

            status.StatusCode = 1;
            status.StatusMessage = "Brands created successfully for the category.";
            return status;
        }

        public async Task<StatusModel> EditCategoriesByBrand(BrandDto model)
        {
            var status = new StatusModel();
            var removeList = await RemoveCategoriesDbByBrand(model);
            var addList = await AddCategoriesDbByBrand(model);
            if (addList == null && removeList == null)
            {
                status.StatusCode = 0;
                status.StatusMessage = "No changes made to categories for the brand.";
                return status;
            }

            if (addList != null && addList.Count > 0)
            {
                await _dbContext.CategoriesBrands.AddRangeAsync(addList);
                await _dbContext.SaveChangesAsync();
            }

            if (removeList != null && removeList.Count > 0)
            {
                _dbContext.CategoriesBrands.RemoveRange(removeList);
                await _dbContext.SaveChangesAsync();
            }

            status.StatusCode = 1;
            status.StatusMessage = "Categories updated successfully for the brand.";
            return status;
        }

        public async Task<StatusModel> EditBrandsByCategory(CategoryDto model)
        {
            var status = new StatusModel();
            var removeList = await RemoveBrandsDbByCategory(model);
            var addList = await AddBrandsDbByCategory(model);
            if (addList == null && removeList == null)
            {
                status.StatusCode = 0;
                status.StatusMessage = "No changes made to brands for the category";
                return status;
            }

            if (addList.Count > 0)
            {
                await _dbContext.CategoriesBrands.AddRangeAsync(addList);
                await _dbContext.SaveChangesAsync();
            }

            if (removeList.Count > 0)
            {
                _dbContext.CategoriesBrands.RemoveRange(removeList);
                await _dbContext.SaveChangesAsync();
            }

            status.StatusCode = 1;
            status.StatusMessage = "Brands updated successfully for the category.";
            return status;
        }

        public async Task<StatusModel> RemoveCategoriesByBrand(int id)
        {
            var status = new StatusModel();
            var categoriesBrands = await _dbContext.CategoriesBrands.Where(i => i.BrandId == id).ToListAsync();
            if (categoriesBrands.Count <= 0 || categoriesBrands == null)
            {
                status.StatusCode = 0;
                status.StatusMessage = "No categories found for the specified brand.";
                return status;
            }

            _dbContext.CategoriesBrands.RemoveRange(categoriesBrands);
            await _dbContext.SaveChangesAsync();

            status.StatusCode = 1;
            status.StatusMessage = "Categories removed successfully for the brand.";
            return status;
        }

        public async Task<StatusModel> RemoveBrandsByCategory(int id)
        {
            var status = new StatusModel();
            var categoriesBrands = await _dbContext.CategoriesBrands.Where(i => i.CategoryId == id).ToListAsync();
            if (categoriesBrands.Count <= 0 || categoriesBrands == null)
            {
                status.StatusCode = 0;
                status.StatusMessage = "No brands found for the specified category.";
                return status;
            }

            _dbContext.CategoriesBrands.RemoveRange(categoriesBrands);
            await _dbContext.SaveChangesAsync();

            status.StatusCode = 1;
            status.StatusMessage = "Brands removed successfully for the category.";
            return status;
        }

        private async Task<List<CategoriesBrandsModel>> AddCategoriesDbByBrand(BrandDto model)
        {
            var categoriesFromDB = await _dbContext.CategoriesBrands.Where(i => i.BrandId == model.Id).Select(i => i.CategoryId).ToListAsync();
            var categoriesByBrand = new List<CategoriesBrandsModel>();
            foreach (var item in model.CategoriesId)
            {
                if (!categoriesFromDB.Contains(item))
                {
                    categoriesByBrand.Add(new CategoriesBrandsModel { BrandId = model.Id, CategoryId = item });
                }
            }

            if (categoriesByBrand == null || categoriesByBrand.Count <= 0)
            {
                return null;
            }

            return categoriesByBrand;
        }

        private async Task<List<CategoriesBrandsModel>> RemoveCategoriesDbByBrand(BrandDto model)
        {
            var categoriesFromDB = await _dbContext.CategoriesBrands.Where(i => i.BrandId == model.Id).Select(i => i.CategoryId).ToListAsync();
            var categoriesByBrand = new List<CategoriesBrandsModel>();
            foreach (var item in categoriesFromDB)
            {
                if (!model.CategoriesId.Contains(item))
                {
                    categoriesByBrand.Add(new CategoriesBrandsModel { BrandId = model.Id, CategoryId = item });
                }
            }

            if (categoriesByBrand == null || categoriesByBrand.Count <= 0)
            {
                return null;
            }

            return categoriesByBrand;
        }

        private async Task<List<CategoriesBrandsModel>> AddBrandsDbByCategory(CategoryDto model)
        {
            var brandsIdFromDB = await _dbContext.CategoriesBrands.Where(i => i.CategoryId == model.Id).Select(i => i.BrandId).ToListAsync();
            var brandsByCategory = new List<CategoriesBrandsModel>();
            foreach (var item in model.BrandsId)
            {
                if (!brandsIdFromDB.Contains(item))
                {
                    brandsByCategory.Add(new CategoriesBrandsModel { BrandId = item, CategoryId = model.Id });
                }
            }

            if (brandsByCategory == null || brandsByCategory.Count <= 0)
            {
                return null;
            }

            return brandsByCategory;
        }

        private async Task<List<CategoriesBrandsModel>> RemoveBrandsDbByCategory(CategoryDto model)
        {
            var brandsIdFromDB = await _dbContext.CategoriesBrands.Where(i => i.CategoryId == model.Id).Select(i => i.BrandId).ToListAsync();
            var brandsByCategory = new List<CategoriesBrandsModel>();
            foreach (var item in brandsIdFromDB)
            {
                if (!model.BrandsId.Contains(item))
                {
                    brandsByCategory.Add(new CategoriesBrandsModel { BrandId = item, CategoryId = model.Id });
                }
            }

            if (brandsByCategory == null || brandsByCategory.Count <= 0)
            {
                return null;
            }

            return brandsByCategory;
        }
    }
}
