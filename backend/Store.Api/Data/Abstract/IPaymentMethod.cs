using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Store.Data.Models;

namespace Store.Api.Data.Abstract
{
    public interface IPaymentMethod
    {
        Task<List<PaymentMethodModel>> GetPaymentMethods();
        Task<StatusModel> CreatePaymentMethod(string name);
        Task<StatusModel> EditPaymentMethod(PaymentMethodModel model);
        Task<StatusModel> DeletePaymentMethod(int id);
    }
}
