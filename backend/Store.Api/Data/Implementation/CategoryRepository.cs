using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Store.Api.Data;
using Store.Api.Data.Abstract;
using Store.Data.Constants;
using Store.Data.Models;
using Store.Data.Models.Dtos;

#pragma warning disable CS8603
#pragma warning disable CS8619

namespace Store.Api.Data.Implementation
{
    public class CategoryRepository : ICategory
    {
        private readonly AppDBContext _dbContext;
        private readonly ISaveImg _saveImg;
        private readonly ICategoriesBrands _categoriesBrands;

        public CategoryRepository(AppDBContext context, ISaveImg saveImg, ICategoriesBrands categoriesBrands)
        {
            _dbContext = context;
            _saveImg = saveImg;
            _categoriesBrands = categoriesBrands;
        }

        public async Task<CategoryModel> GetCategoryById(int id)
        {
            var category = await _dbContext.Category.FirstOrDefaultAsync(i => i.Id == id);
            if (category == null)
            {
                return null;
            }

            return category;
        }

        public async Task<CategoryModel> GetCategoryByName(string name)
        {
            var category = await _dbContext.Category.FirstOrDefaultAsync(i => i.Name == name);
            if (category == null)
            {
                return null;
            }

            return category;
        }

        public async Task<List<CategoryModel>> GetCategories(int brandId)
        {
            switch (brandId)
            {
                case <= 0:
                    return await _dbContext.Category.ToListAsync();
                case > 0:
                    var categoriesId = await _dbContext.CategoriesBrands.Where(i => i.BrandId == brandId).Select(i => i.CategoryId).ToListAsync();
                    if (categoriesId == null || categoriesId.Count <= 0)
                    {
                        return null;
                    }

                    return await _dbContext.Category.Where(i => categoriesId.Contains(i.Id)).ToListAsync();
            }
        }

        public async Task<(int countPages, List<CategoryModel> categories)> GetTableCategories(int currentPage)
        {
            var categories = await _dbContext.Category.ToListAsync();
            if (categories == null || categories.Count < 1)
            {
                return (0, null);
            }

            var countPages = (int)Math.Ceiling(categories.Count / (double)ConstParameters.LIMIT_TABLE_ONE_PAGE);
            var start = ConstParameters.LIMIT_TABLE_ONE_PAGE * (currentPage - 1);
            categories = categories.Skip(start).Take(ConstParameters.LIMIT_TABLE_ONE_PAGE).ToList();

            return (countPages, categories);
        }

        public async Task<List<CategoryModel>> GetCategoriesPopular(int count)
        {
            var categories = await _dbContext.Category.ToListAsync();
            if (categories == null || categories.Count < 1)
            {
                return null;
            }

            categories = count > categories.Count ? categories.OrderByDescending(i => i.CountView).Take(count).ToList() : categories;

            return categories;
        }

        public async Task<StatusModel> CreateCategory(CategoryDto model)
        {
            var status = await IsCategoryNameAvailable(model.Name, 0);
            if (status.StatusCode == 0)
            {
                return status;
            }

            var category = new CategoryModel
            {
                Name = model.Name,
                Img = model.Img != null ? await _saveImg.SaveImg(model.Img) : string.Empty,
                ShortDescription = !string.IsNullOrEmpty(model.ShortDescription) ? model.ShortDescription : string.Empty,
                Info = !string.IsNullOrEmpty(model.Info) ? model.Info : string.Empty,
                CountView = model.CountView != 0 ? model.CountView : 0
            };

            await _dbContext.Category.AddAsync(category);
            await _dbContext.SaveChangesAsync();

            status.StatusCode = 1;
            status.StatusMessage = "Category created successfully.";
            return status;
        }

        public async Task<StatusModel> EditCategory(CategoryDto model)
        {
            var status = await IsCategoryNameAvailable(model.Name, model.Id);
            if (status.StatusCode == 0)
            {
                return status;
            }

            var category = await _dbContext.Category.FirstOrDefaultAsync(i => i.Id == model.Id);
            if (category == null)
            {
                status.StatusCode = 0;
                status.StatusMessage = "Failed to find the category.";
                return status;
            }

            category.Name = !string.IsNullOrEmpty(model.Name) ? model.Name : category.Name;
            category.ShortDescription = !string.IsNullOrEmpty(model.ShortDescription) ? model.ShortDescription : category.ShortDescription;
            category.Img = model.Img != null ? await _saveImg.SaveImg(model.Img) : category.Img;
            category.Info = !string.IsNullOrEmpty(model.Info) ? model.Info : category.Info;
            category.CountView = model.CountView != 0 ? model.CountView : category.CountView;

            _dbContext.Category.Update(category);
            await _dbContext.SaveChangesAsync();

            status.StatusCode = 1;
            status.StatusMessage = "Category updated successfully.";
            return status;
        }

        public async Task<StatusModel> DeleteCategory(int id)
        {
            var status = new StatusModel();
            var category = await _dbContext.Category.FirstOrDefaultAsync(i => i.Id == id);
            if (category == null)
            {
                status.StatusCode = 0;
                status.StatusMessage = "Failed to find the category.";
                return status;
            }

            var productsByCategory = await _dbContext.Product.Where(i => i.CategoryId == category.Id).ToListAsync();
            if (productsByCategory != null)
            {
                status.StatusCode = 0;
                status.StatusMessage = "There are products associated with the category.";
                return status;
            }

            status = await _categoriesBrands.RemoveBrandsByCategory(id);
            if (status.StatusCode == 0)
            {
                return status;
            }

            _dbContext.Category.Remove(category);
            await _dbContext.SaveChangesAsync();

            status.StatusCode = 1;
            status.StatusMessage = "Category deleted successfully.";
            return status;
        }

        public async Task<StatusModel> CountView(int id)
        {
            var status = new StatusModel();
            var category = await _dbContext.Category.FirstOrDefaultAsync(i => i.Id == id);
            if (category == null)
            {
                status.StatusCode = 0;
                status.StatusMessage = "Failed to find the category.";
                return status;
            }

            category.CountView += 1;
            _dbContext.Category.Update(category);
            await _dbContext.SaveChangesAsync();

            status.StatusCode = 1;
            status.StatusMessage = "Brand view count updated successfully.";
            return status;
        }

        private async Task<StatusModel> IsCategoryNameAvailable(string name, int id)
        {
            var status = new StatusModel();
            var categoryNameExists = await _dbContext.Category.AnyAsync(i => i.Name == name && i.Id == id);
            if (!categoryNameExists)
            {
                status.StatusCode = 1;
                status.StatusMessage = "The name is available";
                return status;
            }

            status.StatusCode = 0;
            status.StatusMessage = "The name isn`t available";
            return status;
        }
    }
}
