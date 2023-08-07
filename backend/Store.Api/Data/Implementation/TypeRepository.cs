using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Store.Api.Data;
using Store.Api.Data.Abstract;
using Store.Data.Constants;
using Store.Data.Models;

#pragma warning disable CS8603
#pragma warning disable CS8619

namespace Store.Api.Data.Implementation
{
    public class TypeRepository : IType
    {
        private readonly AppDBContext _dbContext;

        public TypeRepository(AppDBContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<List<TypeModel>> GetTypes(int categoryId, int brandId)
        {
            if (categoryId > 0 && brandId <= 0)
            {
                return await _dbContext.Type.Where(i => i.CategoryId == categoryId).ToListAsync();
            }
            else if (categoryId > 0 && brandId > 0)
            {
                return await _dbContext.Product
                   .Where(i => i.CategoryId == categoryId && i.BrandId == brandId)
                   .Select(i => i.Type)
                   .ToListAsync();
            }
            else
            {
                return await _dbContext.Type.ToListAsync();
            }
        }

        public async Task<(int countPages, List<TypeModel> types)> GetTableTypes(int currentPage)
        {
            var types = await _dbContext.Type.ToListAsync();
            if (types == null || types.Count < 1)
            {
                return (0, null);
            }

            var countPages = (int)Math.Ceiling(types.Count / (double)ConstParameters.LIMIT_TABLE_ONE_PAGE);
            var start = ConstParameters.LIMIT_TABLE_ONE_PAGE * (currentPage - 1);
            types = types.Skip(start).Take(ConstParameters.LIMIT_TABLE_ONE_PAGE).ToList();

            return (countPages, types);
        }

        public async Task<List<TypeModel>> GetTypesByBrand(List<int> typesId)
        {
            var types = await _dbContext.Type.Where(i => typesId.Contains(i.Id)).ToListAsync();
            if (types == null || types.Count < 1)
            {
                return null;
            }

            return types;
        }

        public async Task<StatusModel> CreateType(TypeModel model)
        {
            var status = await IsTypeNameAvailable(model.Name, 0);
            if (status.StatusCode == 0)
            {
                return status;
            }

            await _dbContext.Type.AddAsync(model);
            await _dbContext.SaveChangesAsync();

            status.StatusCode = 1;
            status.StatusMessage = "Type created successfully.";
            return status;
        }

        public async Task<StatusModel> EditType(TypeModel model)
        {
            var status = await IsTypeNameAvailable(model.Name, model.Id);
            if (status.StatusCode == 0)
            {
                return status;
            }

            var type = await _dbContext.Type.FirstOrDefaultAsync(i => i.Id == model.Id);
            if (type == null)
            {
                status.StatusCode = 0;
                status.StatusMessage = "Failed to find the type.";
                return status;
            }

            type.Name = !string.IsNullOrEmpty(model.Name) ? model.Name : type.Name;
            type.CategoryId = model.CategoryId != 0 ? model.CategoryId : type.CategoryId;

            _dbContext.Type.Update(type);
            await _dbContext.SaveChangesAsync();

            status.StatusCode = 1;
            status.StatusMessage = "Type updated successfully.";
            return status;
        }

        public async Task<StatusModel> DeleteType(int id)
        {
            var status = new StatusModel();
            var type = await _dbContext.Type.FirstOrDefaultAsync(i => i.Id == id);
            if (type == null)
            {
                status.StatusCode = 0;
                status.StatusMessage = "Failed to find the type.";
                return status;
            }


            var products = await _dbContext.Product.Where(i => i.TypeId == type.Id).ToListAsync();
            if (products.Count > 0 || products != null)
            {
                status.StatusCode = 0;
                status.StatusMessage = "There are products associated with the type.";
                return status;
            }

            _dbContext.Type.Remove(type);
            await _dbContext.SaveChangesAsync();

            status.StatusCode = 1;
            status.StatusMessage = "Type deleted successfully.";
            return status;
        }

        private async Task<StatusModel> IsTypeNameAvailable(string name, int id)
        {
            var status = new StatusModel();
            var brandNameExists = await _dbContext.Type.AnyAsync(i => i.Name == name && i.Id == id);
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
