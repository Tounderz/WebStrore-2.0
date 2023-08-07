using Microsoft.EntityFrameworkCore;
using Store.Api.Data;
using Store.Api.Data.Abstract;
using Store.Data.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

#pragma warning disable CS8603

namespace Store.Api.Data.Implementation
{
    public class ProductInfoRepository : IProductInfo
    {
        private readonly AppDBContext _dbContext;

        public ProductInfoRepository(AppDBContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<List<ProductInfoModel>> GetProductInfos(int productId)
        {
            var productInfos = await _dbContext.ProductInfo.Where(i => i.ProductId == productId).ToListAsync();
            if (productInfos == null || productInfos.Count < 1)
            {
                return null;
            }

            return productInfos;
        }

        public async Task<StatusModel> CreateProductInfo(ProductInfoModel model)
        {
            var status = await IsInfoTitleAvailable(model.ProductId, model.Title);
            if (status.StatusCode == 0)
            {
                return status;
            }

            var info = new ProductInfoModel
            {
                ProductId = model.ProductId,
                Title = model.Title,
                Description = model.Description
            };

            await _dbContext.ProductInfo.AddAsync(info);
            await _dbContext.SaveChangesAsync();

            status.StatusCode = 1;
            status.StatusMessage = "Product info created successfully";
            return status;
        }

        public async Task<StatusModel> EditProductInfo(ProductInfoModel model)
        {
            var status = await IsInfoTitleAvailable(model.ProductId, model.Title);
            if (status.StatusCode == 0)
            {
                return status;
            }

            var info = await _dbContext.ProductInfo.FirstOrDefaultAsync(i => i.Id == model.Id);
            if (info == null)
            {
                status.StatusCode = 0;
                status.StatusMessage = "Product info not found";
                return status;
            }

            info.Title = !string.IsNullOrEmpty(model.Title) ? model.Title : info.Title;
            info.Description = !string.IsNullOrEmpty(model.Description) ? model.Description : info.Description;

            _dbContext.ProductInfo.Update(info);
            await _dbContext.SaveChangesAsync();

            status.StatusCode = 1;
            status.StatusMessage = "Product info updated successfully";
            return status;
        }

        public async Task<StatusModel> DeleteInfo(int id)
        {
            var status = new StatusModel();
            var info = await _dbContext.ProductInfo.FirstOrDefaultAsync(i => i.Id == id);
            if (info == null)
            {
                status.StatusCode = 0;
                status.StatusMessage = "Product info not found";
                return status;
            }

            _dbContext.ProductInfo.Remove(info);
            await _dbContext.SaveChangesAsync();

            status.StatusCode = 1;
            status.StatusMessage = "Product info deleted successfully";
            return status;
        }

        public async Task<StatusModel> DeleteProductInfos(int productId)
        {
            var status = new StatusModel();
            var infos = await _dbContext.ProductInfo.Where(i => i.ProductId == productId).ToListAsync();
            if (infos == null || infos.Count < 1)
            {
                status.StatusCode = 0;
                status.StatusMessage = "No product infos found";
                return status;
            }

            _dbContext.ProductInfo.RemoveRange(infos);
            await _dbContext.SaveChangesAsync();

            status.StatusCode = 1;
            status.StatusMessage = "Product infos deleted successfully";
            return status;
        }

        private async Task<StatusModel> IsInfoTitleAvailable(int productId, string title)
        {
            var status = new StatusModel();
            var infoTitleExists = await _dbContext.ProductInfo.AnyAsync(i => i.Title == title && i.ProductId == productId);
            if (!infoTitleExists)
            {
                status.StatusCode = 1;
                status.StatusMessage = "The title is available";
                return status;
            }

            status.StatusCode = 0;
            status.StatusMessage = "The title isn`t available";
            return status;
        }
    }
}
