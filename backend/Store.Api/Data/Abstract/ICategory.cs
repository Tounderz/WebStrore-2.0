using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Store.Data.Models;
using Store.Data.Models.Dtos;

namespace Store.Api.Data.Abstract
{
    public interface ICategory
    {
        Task<CategoryModel> GetCategoryById(int id);
        Task<CategoryModel> GetCategoryByName(string name);
        Task<List<CategoryModel>> GetCategories(int brandId);
        Task<(int countPages, List<CategoryModel> categories)> GetTableCategories(int currentPage);
        Task<List<CategoryModel>> GetCategoriesPopular(int count);
        Task<StatusModel> CreateCategory(CategoryDto model);
        Task<StatusModel> EditCategory(CategoryDto model);
        Task<StatusModel> DeleteCategory(int id);
        Task<StatusModel> CountView(int id);
    }
}
