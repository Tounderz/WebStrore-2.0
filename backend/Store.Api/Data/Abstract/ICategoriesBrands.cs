using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Store.Data.Models;
using Store.Data.Models.Dtos;

namespace Store.Api.Data.Abstract
{
    public interface ICategoriesBrands
    {
        Task<StatusModel> CreateBrandsByCategory(CategoryDto model);
        Task<StatusModel> EditBrandsByCategory(CategoryDto model);
        Task<StatusModel> CreateCategoriesByBrand(BrandDto model);
        Task<StatusModel> EditCategoriesByBrand(BrandDto model);
        Task<StatusModel> RemoveBrandsByCategory(int id);
        Task<StatusModel> RemoveCategoriesByBrand(int id);
    }
}
