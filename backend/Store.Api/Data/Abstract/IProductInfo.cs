using System.Collections.Generic;
using System.Threading.Tasks;
using Store.Data.Models;

namespace Store.Api.Data.Abstract
{
    public interface IProductInfo
    {
        Task<List<ProductInfoModel>> GetProductInfos(int productId);
        Task<StatusModel> CreateProductInfo(ProductInfoModel model);
        Task<StatusModel> EditProductInfo(ProductInfoModel model);
        Task<StatusModel> DeleteInfo(int id);
        Task<StatusModel> DeleteProductInfos(int productId);
    }
}
