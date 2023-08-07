using System;
using Store.Data.Models;
using Store.Data.Models.Dtos;

namespace Store.Api.Data.Abstract
{
    public interface ICart
    {
        Task<(int sum, List<ProductModel> products)> GetCartItems(int userId);
        Task<StatusModel> AddToCartItem(CartDto dto);
        Task<StatusModel> DeleteCartItem(int productId, int userId);
        Task<StatusModel> CleanCart(int userId);
    }
}
