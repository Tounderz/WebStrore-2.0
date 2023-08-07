using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
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
    public class BrandRepository : IBrand
    {
        private readonly AppDBContext _dbContext;
        private readonly ISaveImg _saveImg;
        private readonly ICategoriesBrands _categoriesBrands;

        public BrandRepository(AppDBContext dbContext, ISaveImg saveImg, ICategoriesBrands categoriesBrands)
        {
            _dbContext = dbContext;
            _saveImg = saveImg;
            _categoriesBrands = categoriesBrands;
        }

        public async Task<BrandModel> GetBrandById(int id)
        {
            var brand = await _dbContext.Brand.FirstOrDefaultAsync(i => i.Id == id);
            if (brand == null)
            {
                return null;
            }

            return brand;
        }

        public async Task<BrandModel> GetBrandByName(string name)
        {
            var brand = await _dbContext.Brand.FirstOrDefaultAsync(i => i.Name == name);
            if (brand == null)
            {
                return null;
            }

            return brand;
        }

        public async Task<List<BrandModel>> GetBrands(int categoryId)
        {
            if (categoryId < 1)
            {
                return await _dbContext.Brand.ToListAsync();
            }
            else
            {
                var brandsId = await _dbContext.CategoriesBrands.Where(i => i.CategoryId == categoryId).Select(i => i.BrandId).ToListAsync();
                if (brandsId.Count <= 0 || brandsId == null)
                {
                    return null;
                }

                return await _dbContext.Brand.Where(i => brandsId.Contains(i.Id)).ToListAsync();
            }
        }

        public async Task<(int countPages, List<BrandModel> brands)> GetTableBrands(int currentPage)
        {
            var brands = await _dbContext.Brand.ToListAsync();
            if (brands == null || brands.Count < 1)
            {
                return (0, null);
            }

            var countPages = (int)Math.Ceiling(brands.Count / (double)ConstParameters.LIMIT_TABLE_ONE_PAGE);
            var start = ConstParameters.LIMIT_TABLE_ONE_PAGE * (currentPage - 1);
            brands = brands.Skip(start).Take(ConstParameters.LIMIT_TABLE_ONE_PAGE).ToList();

            return (countPages, brands);
        }

        public async Task<List<BrandModel>> GetBrandsPopular(int count)
        {
            var brands = await _dbContext.Brand.ToListAsync();
            if (brands == null || brands.Count < 1)
            {
                return null;
            }

            brands = count > brands.Count ? brands.OrderByDescending(i => i.CountView).Take(count).ToList() : brands;

            return brands;
        }

        public async Task<StatusModel> CreateBrand(BrandDto model)
        {
            var status = await IsBrandNameAvailable(model.Name, 0);
            if (status.StatusCode == 0)
            {
                return status;
            }

            var brand = new BrandModel
            {
                Name = model.Name,
                Img = model.Img != null ? await _saveImg.SaveImg(model.Img) : string.Empty,
                Info = !string.IsNullOrEmpty(model.Info) ? model.Info : string.Empty,
                CountView = model.CountView != 0 ? model.CountView : 0
            };

            await _dbContext.Brand.AddAsync(brand);
            await _dbContext.SaveChangesAsync();

            status.StatusCode = 1;
            status.StatusMessage = "Brand created successfully.";
            return status;
        }

        public async Task<StatusModel> EditBrand(BrandDto model)
        {
            var status = !string.IsNullOrEmpty(model.Name) ? await IsBrandNameAvailable(model.Name, model.Id) : new StatusModel { StatusCode = 1 };
            if (status.StatusCode == 0)
            {
                return status;
            }

            var brand = await _dbContext.Brand.FirstOrDefaultAsync(i => i.Id == model.Id);
            if (brand == null)
            {
                status.StatusCode = 0;
                status.StatusMessage = "Failed to find the brand.";
                return status;
            }

            brand.Name = model.Name != string.Empty ? model.Name : brand.Name;
            brand.Img = model.Img != null ? await _saveImg.SaveImg(model.Img) : brand.Img;
            brand.Info = model.Info != string.Empty ? model.Info : brand.Info;
            brand.CountView = model.CountView != 0 ? model.CountView : brand.CountView;

            if (model.CategoriesId != null && model.CategoriesId.Length > 0)
            {
                status = await _categoriesBrands.EditCategoriesByBrand(model);
            }

            if (status.StatusCode == 0)
            {
                return status;
            }

            _dbContext.Brand.Update(brand);
            await _dbContext.SaveChangesAsync();

            status.StatusCode = 1;
            status.StatusMessage = "Brand updated successfully.";
            return status;
        }

        public async Task<StatusModel> DeleteBrand(int id)
        {
            var status = new StatusModel();
            var brand = await _dbContext.Brand.FirstOrDefaultAsync(i => i.Id == id);
            if (brand == null)
            {
                status.StatusCode = 0;
                status.StatusMessage = "Failed to find the brand.";
                return status;
            }

            var productsByBrand = await _dbContext.Product.Where(i => i.BrandId == brand.Id).ToListAsync();
            if (productsByBrand != null)
            {
                status.StatusCode = 0;
                status.StatusMessage = "There are products associated with the brand.";
                return status;
            }

            status = await _categoriesBrands.RemoveCategoriesByBrand(id);
            if (status.StatusCode == 0)
            {
                return status;
            }

            _dbContext.Brand.Remove(brand);
            await _dbContext.SaveChangesAsync();

            status.StatusCode = 1;
            status.StatusMessage = "Brand deleted successfully.";
            return status;
        }

        public async Task<StatusModel> CountView(int id)
        {
            var status = new StatusModel();
            var brand = await _dbContext.Brand.FirstOrDefaultAsync(i => i.Id == id);
            if (brand == null)
            {
                status.StatusCode = 0;
                status.StatusMessage = "Failed to find the brand.";
                return status;
            }

            brand.CountView += 1;
            _dbContext.Brand.Update(brand);
            await _dbContext.SaveChangesAsync();

            status.StatusCode = 1;
            status.StatusMessage = "Brand view count updated successfully.";
            return status;
        }

        private async Task<StatusModel> IsBrandNameAvailable(string name, int id)
        {
            var status = new StatusModel();
            var brandNameExists = await _dbContext.Brand.AnyAsync(i => i.Name == name && i.Id == id);
            if (!brandNameExists)
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
