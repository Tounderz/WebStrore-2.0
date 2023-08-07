using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Store.Api.Data.Abstract;
using Store.Data.Constants;
using Store.Data.Models;

namespace Store.Api.Controllers
{
    [Route(ConstRouteTitle.PAYMENT_METHODS_ROUTE)]
    [ApiController]
    public class PaymentMethodController : ControllerBase
    {
        private readonly IPaymentMethod _method;

        public PaymentMethodController(IPaymentMethod paymentMethod)
        {
            _method = paymentMethod;
        }

        [HttpGet(ConstTitleMethods.LIST)]
        public async Task<IActionResult> GetPaymentMethod()
        {
            var paymentMethods = await _method.GetPaymentMethods();
            if (paymentMethods == null)
            {
                return BadRequest(new { message = "No payment methods found." });
            }

            return Ok(new { paymentMethods = paymentMethods });
        }

        [HttpPost(ConstTitleMethods.CREATE)]
        public async Task<IActionResult> CreateMethod(string name)
        {
            if (string.IsNullOrEmpty(name))
            {
                return BadRequest(new { message = "Invalid payment method data." });
            }

            var status = await _method.CreatePaymentMethod(name);
            if (status.StatusCode == 0)
            {
                return BadRequest(new { message = status.StatusMessage });
            }

            return Ok(new { success = true, message = status.StatusMessage });
        }

        [HttpPost(ConstTitleMethods.EDIT)]
        public async Task<IActionResult> EditMethod(PaymentMethodModel model)
        {
            var status = await _method.EditPaymentMethod(model);
            if (status.StatusCode == 0)
            {
                return BadRequest(new { message = status.StatusMessage });
            }

            return Ok(new { success = true, message = status.StatusMessage });
        }

        [HttpDelete(ConstTitleMethods.DELETE)]
        public async Task<IActionResult> DeleteMethod(int id)
        {
            var status = await _method.DeletePaymentMethod(id);
            if (status.StatusCode == 0)
            {
                return BadRequest(new { message = status.StatusMessage });
            }

            return Ok(new { success = true, message = status.StatusMessage });
        }
    }
}
