using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Store.Data.Models;
using Store.Data.Models.Dtos;

namespace Store.Api.Data.Abstract
{
    public interface IBrand
    {
        Task<BrandModel> GetBrandById(int id);
        Task<BrandModel> GetBrandByName(string name);
        Task<List<BrandModel>> GetBrands(int categoryId);
        Task<(int countPages, List<BrandModel> brands)> GetTableBrands(int currentPage);
        Task<List<BrandModel>> GetBrandsPopular(int count);
        Task<StatusModel> CreateBrand(BrandDto model);
        Task<StatusModel> EditBrand(BrandDto model);
        Task<StatusModel> DeleteBrand(int id);
        Task<StatusModel> CountView(int id);
    }
}
