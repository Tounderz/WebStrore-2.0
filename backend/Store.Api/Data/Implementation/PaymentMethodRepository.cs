using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Store.Api.Data;
using Store.Api.Data.Abstract;
using Store.Data.Models;

#pragma warning disable CS8603

namespace Store.Api.Data.Implementation
{
    public class PaymentMethodRepository : IPaymentMethod
    {
        private readonly AppDBContext _dbContext;

        public PaymentMethodRepository(AppDBContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<List<PaymentMethodModel>> GetPaymentMethods()
        {
            var methods = await _dbContext.PaymentMethod.ToListAsync();
            if (methods == null || methods.Count < 1)
            {
                return null;
            }

            return methods;
        }

        public async Task<StatusModel> CreatePaymentMethod(string name)
        {
            var status = await IsMethodNameAvailable(name, 0);
            if (status.StatusCode == 0)
            {
                return status;
            }

            var method = new PaymentMethodModel
            {
                Name = name
            };

            await _dbContext.PaymentMethod.AddAsync(method);
            await _dbContext.SaveChangesAsync();

            status.StatusCode = 1;
            status.StatusMessage = "";
            return status;
        }

        public async Task<StatusModel> EditPaymentMethod(PaymentMethodModel model)
        {
            var status = await IsMethodNameAvailable(model.Name, model.Id);
            if (status.StatusCode == 0)
            {
                return status;
            }

            var method = await _dbContext.PaymentMethod.FirstOrDefaultAsync(i => i.Id == model.Id);
            if (method == null)
            {
                status.StatusCode = 0;
                status.StatusMessage = "";
                return status;
            }

            method.Name = model.Name != string.Empty ? model.Name : method.Name;
            _dbContext.PaymentMethod.Update(method);
            await _dbContext.SaveChangesAsync();

            status.StatusCode = 1;
            status.StatusMessage = "";
            return status;
        }

        public async Task<StatusModel> DeletePaymentMethod(int id)
        {
            var status = new StatusModel();
            var method = await _dbContext.PaymentMethod.FirstOrDefaultAsync(i => i.Id == id);
            if (method == null)
            {
                status.StatusCode = 0;
                status.StatusMessage = "";
                return status;
            }

            _dbContext.PaymentMethod.Remove(method);
            await _dbContext.SaveChangesAsync();

            status.StatusCode = 1;
            status.StatusMessage = "";
            return status;
        }

        private async Task<StatusModel> IsMethodNameAvailable(string name, int id)
        {
            var status = new StatusModel();
            var methodNameExists = await _dbContext.PaymentMethod.AnyAsync(i => i.Name == name && i.Id == id);
            if (!methodNameExists)
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
