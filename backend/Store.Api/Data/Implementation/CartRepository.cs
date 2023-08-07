using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Store.Api.Data;
using Store.Api.Data.Abstract;
using Store.Data.Models;
using Store.Data.Models.Dtos;

#pragma warning disable CS8619

namespace Store.Api.Data.Implementation
{
    public class CartRepository : ICart
    {
        private readonly AppDBContext _dbContext;

        public CartRepository(AppDBContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<(int sum, List<ProductModel> products)> GetCartItems(int userId)
        {
            var productIds = await _dbContext.Cart.
                Where(i => i.UserId == userId)
                .Select(i => i.ProductId)
                .ToListAsync();

            if (productIds == null || productIds.Count < 1)
            {
                return (0, null);
            }

            var products = await _dbContext.Product
                .Where(i => productIds.Contains(i.Id))
                .ToListAsync();

            var sum = products.Sum(i => i.Price);

            return (sum, products);
        }

        public async Task<StatusModel> AddToCartItem(CartDto dto)
        {
            var status = new StatusModel();
            var cart = new CartModel
            {
                ProductId = dto.ProductId,
                UserId = dto.UserId,
            };

            await _dbContext.Cart.AddAsync(cart);
            await _dbContext.SaveChangesAsync();

            status.StatusCode = 1;
            status.StatusMessage = "Item added to cart successfully";
            return status;
        }

        public async Task<StatusModel> DeleteCartItem(int productId, int userId)
        {
            var status = new StatusModel();
            var model = await _dbContext.Cart.FirstOrDefaultAsync(x => x.UserId == userId && x.ProductId == productId);
            if (model == null)
            {
                status.StatusCode = 0;
                status.StatusMessage = "Item not found in cart";
                return status;
            }

            _dbContext.Cart.Remove(model);
            await _dbContext.SaveChangesAsync();

            status.StatusCode = 1;
            status.StatusMessage = "Item removed from cart successfully";
            return status;
        }

        public async Task<StatusModel> CleanCart(int userId)
        {
            var status = new StatusModel();
            var models = await _dbContext.Cart.Where(i => i.UserId == userId).ToListAsync();
            if (models == null || models.Count < 1)
            {
                status.StatusCode = 0;
                status.StatusMessage = "Cart is already empty";
                return status;
            }

            _dbContext.Cart.RemoveRange(models);
            await _dbContext.SaveChangesAsync();

            status.StatusCode = 1;
            status.StatusMessage = "Cart cleaned successfully";
            return status;
        }
    }
}
