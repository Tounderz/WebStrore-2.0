using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Store.Api.Data.Abstract;
using Store.Data.Constants;
using Store.Data.Models;
using Store.Data.Models.Dtos;

namespace Store.Api.Controllers
{
    [ApiController]
    [Route(ConstRouteTitle.ORDERS_ROUTE)]
    public class OrderController : ControllerBase
    {
        private readonly IOrder _order;

        public OrderController(IOrder order)
        {
            _order = order;
        }

        [HttpGet(ConstTitleMethods.LIST)]
        public async Task<IActionResult> OrderList(int userId, int currentPage)
        {
            var (countPages, orders) = await _order.OrderList(userId, currentPage);
            if (orders == null)
            {
                return BadRequest(new { message = "You don't have completed purchases!" });
            }

            var totalAmount = orders.Sum(i => i.ProductPrice);

            return Ok(new { orders = orders, totalAmount = totalAmount, countPages = countPages });
        }

        [HttpPost(ConstTitleMethods.PLACE_ORDER)]
        public async Task<IActionResult> CreateOrder(OrderDto dto)
        {
            var status = await _order.CreateOrder(dto);
            if (status.StatusCode == 0)
            {
                return BadRequest(new { message = status.StatusMessage });
            }
                
            return Ok(new { success = true, message = status.StatusMessage });
        }

        [HttpPost(ConstTitleMethods.PLACE_ORDERS)]
        public async Task<IActionResult> OrderAllItemsCart(OrderDto dto)
        {
            var status = await _order.OrderAllItemsCart(dto);
            if (status.StatusCode == 0)
            {
                return BadRequest(new { message = status.StatusMessage });
            }

            return Ok(new { success = true, message = status.StatusMessage });
        }
    }
}