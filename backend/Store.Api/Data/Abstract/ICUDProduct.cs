using System.Collections.Generic;
using System.Threading.Tasks;
using Store.Data.Models;
using Store.Data.Models.Dtos;

namespace Store.Api.Data.Abstract
{
    public interface ICUDProduct
    {
        Task<StatusModel> CreateProduct(ProductDto model);
        Task<StatusModel> EditProduct(ProductDto model);
        Task<StatusModel> BrandChangeProducts(int brandId, List<int> products);
        Task<StatusModel> CategoryChangeProducts(int categoryId, List<int> products);
        Task<StatusModel> TypeChangeProducts(int typeId, List<int> products);
        Task<StatusModel> DeleteProduct(int id);
        Task<StatusModel> DeleteProducts(List<int> products);
        Task<StatusModel> CountView(int id);
    }
}
