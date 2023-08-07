using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Store.Api.Data.Abstract;
using Store.Data.Constants;
using Store.Data.Models.Dtos;

namespace Store.Api.Controllers
{
    [ApiController]
    [Route(ConstRouteTitle.CARTS_ROUTE)]
    public class CartsController : ControllerBase
    {
        private readonly ICart _cart;

        public CartsController(ICart cart)
        {
            _cart = cart;
        }

        [HttpGet(ConstTitleMethods.GET_CART)]
        public async Task<IActionResult> GetCart(int userId)
        {
            var (sum, products) = await _cart.GetCartItems(userId);
            if (products == null)
            {
                return BadRequest(new { message = "No products found in cart" });
            }

            return Ok(new { cart = products, sum = sum });
        }

        [HttpPost(ConstTitleMethods.ADD_TO_CART)]
        public async Task<IActionResult> AddToCart(CartDto dto)
        {
            var status = await _cart.AddToCartItem(dto);
            if (status.StatusCode == 0)
            {
                return BadRequest( new { message = status.StatusMessage });
            }

            return Ok(new { success = true, message = status.StatusMessage,  });
        }

        [HttpDelete(ConstTitleMethods.DELETE_ITEM_CART)]
        public async Task<IActionResult> DeleteCartItem(int productId, int userId) // удаление объекта из корзины
        {
            var status = await _cart.DeleteCartItem(productId, userId);
            if (status.StatusCode == 0)
            {
                return BadRequest(new { message = status.StatusMessage });
            }

            var (sum, cart) =  await _cart.GetCartItems(userId);

            return Ok(new { sum = sum, cart = cart });
        }

        [HttpDelete(ConstTitleMethods.CLEAN_CART)]
        public async Task<IActionResult> CleanCart(int userId)//очистка корзины
        {
            var status = await _cart.CleanCart(userId);
            if (status.StatusCode == 0)
            {
                return BadRequest(new { message = status.StatusMessage });
            }

            return Ok(new { sum = 0 });
        }
    }
}