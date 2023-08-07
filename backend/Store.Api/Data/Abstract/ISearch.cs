using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Store.Data.Models;

namespace Store.Api.Data.Abstract
{
    public interface ISearch
    {
        Task<(int countPages, List<ProductModel> products)> ResaultSearch(string parameter, int currentPage);
        Task<(int countPages, List<ProductTableModel> products)> ResaultSearchProducts(string parameter, int currentPage, string criteria);
        Task<(int countPages, List<CategoryModel> categories)> ResaultSearchCategories(string parameter, int currentPage, string criteria);
        Task<(int countPages, List<BrandModel> brands)> ResaultSearchBrands(string parameter, int currentPage, string criteria);
        Task<(int countPages, List<TypeModel> types)> ResaultSearchTypes(string parameter, int currentPage, string criteria);
        Task<(int countPages, List<PaymentMethodModel> paymentMethods)> ResaultSearchPaymentMethod(string parameter, int currentPage, string criteria);
    }
}
