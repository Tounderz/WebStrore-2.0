using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Store.Data.Models;

namespace Store.Api.Data.Abstract
{
    public interface IType
    {
        Task<List<TypeModel>> GetTypes(int categoryId, int brandId);
        Task<(int countPages, List<TypeModel> types)> GetTableTypes(int currentPage);
        Task<List<TypeModel>> GetTypesByBrand(List<int> typesId);
        Task<StatusModel> CreateType(TypeModel model);
        Task<StatusModel> EditType(TypeModel model);
        Task<StatusModel> DeleteType(int id);
    }
}
