using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Store.Data.Models;

namespace Store.Api.Data.Abstract
{
    public interface ISort
    {
        Task<(int countPages, List<ProductTableModel> products)> SortProduct(string propertyTitle, string typeSort, int currentPage);
        Task<(int countPages, List<CategoryModel> categories)> SortCategory(string propertyTitle, string typeSort, int currentPage);
        Task<(int countPages, List<BrandModel> brands)> SortBrand(string propertyTitle, string typeSort, int currentPage);
        Task<(int countPages, List<TypeModel> types)> SortType(string propertyTitle, string typeSort, int currentPage);
        Task<(int countPages, List<PaymentMethodModel> paymentMethods)> SortPaymentMethod(string propertyTitle, string typeSort, int currentPage);
    }
}
