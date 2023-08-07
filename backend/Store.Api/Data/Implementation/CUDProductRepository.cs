using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;
using Store.Api.Data;
using Store.Data.Models;
using Store.Api.Data.Abstract;
using Store.Data.Models.Dtos;

namespace Store.Api.Data.Implementation
{
    public class CUDProductRepository : ICUDProduct
    {
        private readonly AppDBContext _dbContext;
        private readonly ISaveImg _saveImg;

        public CUDProductRepository(AppDBContext context, ISaveImg saveImg)
        {
            _dbContext = context;
            _saveImg = saveImg;
        }
        public async Task<StatusModel> CreateProduct(ProductDto model)
        {
            var status = await IsProductNameAvailable(model.Name, 0);
            if (status.StatusCode == 0)
            {
                return status;
            }

            var product = new ProductModel
            {
                Name = model.Name,
                CategoryId = model.CategoryId,
                TypeId = model.TypeId,
                BrandId = model.BrandId,
                Price = model.Price,
                Img = model.Img != null ? await _saveImg.SaveImg(model.Img) : string.Empty,
                ShortDescription = model.ShortDescription,
                IsFavourite = bool.TryParse(model.IsFavourite, out var isFavourite) && isFavourite,
                Available = bool.TryParse(model.Available, out var available) || available,
                CountView = 0
            };

            await _dbContext.Product.AddAsync(product);
            await _dbContext.SaveChangesAsync();

            status.StatusCode = 1;
            status.StatusMessage = "The product has been created successfully";
            return status;
        }

        public async Task<StatusModel> EditProduct(ProductDto model)
        {
            var status = await IsProductNameAvailable(model.Name, model.Id);
            if (status.StatusCode == 0)
            {
                return status;
            }

            var product = await _dbContext.Product.FirstOrDefaultAsync(i => i.Id == model.Id);
            if (product == null)
            {
                status.StatusCode = 0;
                status.StatusMessage = "Product not found";
                return status;
            }

            product.Name = model.Name ?? product.Name;
            product.CategoryId = model.CategoryId != 0 ? model.CategoryId : product.CategoryId;
            product.TypeId = model.TypeId != 0 ? model.TypeId : product.TypeId;
            product.BrandId = model.BrandId != 0 ? model.BrandId : product.BrandId;
            product.ShortDescription = model.ShortDescription ?? product.ShortDescription;
            product.Price = model.Price > 0 ? model.Price : product.Price;
            product.Img = model.Img != null ? await _saveImg.SaveImg(model.Img) : product.Img;
            product.Available = bool.TryParse(model.Available, out var available) ? available : product.Available;
            product.IsFavourite = bool.TryParse(model.IsFavourite, out var isFavourite) ? isFavourite : product.IsFavourite;
            product.CountView = model.CountView != 0 ? model.CountView : product.CountView;

            _dbContext.Product.Update(product);
            await _dbContext.SaveChangesAsync();

            status.StatusCode = 1;
            status.StatusMessage = "The product has been updated successfully";
            return status;
        }

        public async Task<StatusModel> BrandChangeProducts(int brandId, List<int> products)
        {
            var status = new StatusModel();
            var productsDb = await _dbContext.Product.Where(i => products.Contains(i.Id)).ToListAsync();
            if (productsDb == null || productsDb.Count < 1)
            {
                status.StatusCode = 0;
                status.StatusMessage = "";
                return status;
            }

            foreach (var item in productsDb)
            {
                item.BrandId = brandId;
            }

            _dbContext.Product.UpdateRange(productsDb);
            await _dbContext.SaveChangesAsync();

            status.StatusCode = 1;
            status.StatusMessage = "";
            return status;
        }

        public async Task<StatusModel> CategoryChangeProducts(int categoryId, List<int> products)
        {
            var status = new StatusModel();
            var productsDb = await _dbContext.Product.Where(i => products.Contains(i.Id)).ToListAsync();
            if (productsDb == null || productsDb.Count < 1)
            {
                status.StatusCode = 0;
                status.StatusMessage = "";
                return status;
            }

            foreach (var item in productsDb)
            {
                item.CategoryId = categoryId;
            }

            _dbContext.Product.UpdateRange(productsDb);
            await _dbContext.SaveChangesAsync();

            status.StatusCode = 1;
            status.StatusMessage = "";
            return status;
        }
        public async Task<StatusModel> TypeChangeProducts(int typeId, List<int> products)
        {
            var status = new StatusModel();
            var productsDb = await _dbContext.Product.Where(i => products.Contains(i.Id)).ToListAsync();
            if (productsDb == null || productsDb.Count < 1)
            {
                status.StatusCode = 0;
                status.StatusMessage = "";
                return status;
            }

            foreach (var item in productsDb)
            {
                item.TypeId = typeId;
            }

            _dbContext.Product.UpdateRange(productsDb);
            await _dbContext.SaveChangesAsync();

            status.StatusCode = 1;
            status.StatusMessage = "";
            return status;
        }

        public async Task<StatusModel> DeleteProduct(int id)
        {
            var status = new StatusModel();
            var product = await _dbContext.Product.FirstOrDefaultAsync(i => i.Id == id);
            if (product == null)
            {
                status.StatusCode = 0;
                status.StatusMessage = "Product not found";
                return status;
            }

            _dbContext.Product.Remove(product);
            await _dbContext.SaveChangesAsync();

            status.StatusCode = 1;
            status.StatusMessage = "The product has been deleted successfully";
            return status;
        }

        public async Task<StatusModel> CountView(int id)
        {
            var status = new StatusModel();
            var product = await _dbContext.Product.FirstOrDefaultAsync(i => i.Id == id);
            if (product == null)
            {
                status.StatusCode = 0;
                status.StatusMessage = "Product not found";
                return status;
            }

            product.CountView += 1;
            _dbContext.Product.Update(product);
            await _dbContext.SaveChangesAsync();

            status.StatusCode = 1;
            status.StatusMessage = "Count view has been updated successfully";
            return status;
        }

        public async Task<StatusModel> DeleteProducts(List<int> products)
        {
            var status = new StatusModel();
            var productsDb = await _dbContext.Product.Where(i => products.Contains(i.Id)).ToListAsync();
            if (productsDb == null || productsDb.Count < 1)
            {
                status.StatusCode = 0;
                status.StatusMessage = "";
                return status;
            }

            _dbContext.Product.RemoveRange(productsDb);
            await _dbContext.SaveChangesAsync();
            return status;
        }

        private async Task<StatusModel> IsProductNameAvailable(string name, int id)
        {
            var status = new StatusModel();
            var productNameExists = await _dbContext.Product.AnyAsync(i => i.Name == name && i.Id == id);
            if (!productNameExists)
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
