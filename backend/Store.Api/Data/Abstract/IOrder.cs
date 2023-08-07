using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Store.Data.Models;
using Store.Data.Models.Dtos;

namespace Store.Api.Data.Abstract
{
    public interface IOrder
    {
        Task<StatusModel> CreateOrder(OrderDto dto);
        Task<StatusModel> OrderAllItemsCart(OrderDto dto);
        Task<(int countPages, List<PurchasesHistoryDto> orders)> OrderList(int userId, int currentPage);
        string MessageBodyOrder(OrderModel model, string productName, int productPrice);
    }
}
