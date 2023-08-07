using System.Collections.Generic;
using System.Threading.Tasks;
using Store.Data.Models;

namespace Store.Api.Data.Abstract
{
    public interface IGetProduct
    {
        Task<ProductModel> GetProductById(int id);
        Task<List<ProductModel>> GetProductsPopular(int count);
        Task<List<ProductModel>> GetProductsBrand(int brandId);
        Task<List<ProductModel>> GetProductsCategory(int categoruId);
        Task<List<ProductModel>> GetProductsType(int typeId);
        Task<(int countPages, List<ProductTableModel> products)> GetProductsTable(int currentPage);
        Task<(int countPages, List<ProductModel> products)> GetProductsByBrandId(int currentPage, int brandId, List<int> categoriesId);
        Task<(int countPages, List<ProductModel> products)> GetProductsByCategoryId(int currentPage, int categoryId, List<int> brandsId);
        Task<(int countPages, List<ProductModel> products)> GetProductsBrandsByType(int currentPage, int typeId, List<int> brandsId);
    }
}
