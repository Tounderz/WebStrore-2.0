using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Store.Api.Data;
using Store.Api.Data.Abstract;
using Store.Data.Constants;
using Store.Data.Models;
using Store.Data.Models.Dtos;

#pragma warning disable CS8619

namespace Store.Api.Data.Implementation
{
    public class OrderRepository : IOrder
    {
        private readonly AppDBContext _dbContext;
        private readonly ISendEmail _sendEmail;

        public OrderRepository(AppDBContext dbContext, ISendEmail sendEmail)
        {
            _dbContext = dbContext;
            _sendEmail = sendEmail;
        }

        public async Task<StatusModel> CreateOrder(OrderDto dto)
        {
            var status = new StatusModel();
            var product = await _dbContext.Product.FirstOrDefaultAsync(i => i.Id == dto.ProductId);
            if (product == null)
            {
                status.StatusCode = 0;
                status.StatusMessage = "No product found";
                return status;
            }

            var order = new OrderModel
            {
                UserId = dto.UserId,
                ProductId = product.Id,
                ProductPrice = product.Price,
                UserName = dto.UserName,
                UserPhone = dto.UserPhone,
                UserEmail = dto.UserEmail,
                City = dto.City,
                Street = dto.Street,
                House = dto.House,
                Flat = dto.Flat,
                PaymentMethod = dto.PaymentMethod,
                OrderTime = DateTime.Now.Date,
                OrderComment = string.IsNullOrEmpty(dto.OrderComment) ? string.Empty : dto.OrderComment
            };

            var messageBody = MessageBodyOrder(order, product.Name, product.Price);
            status = await _sendEmail.SendEmail(order.UserEmail, messageBody, "Order");
            if (status.StatusCode == 0)
            {
                return status;
            }

            await _dbContext.Order.AddAsync(order);
            await _dbContext.SaveChangesAsync();

            status.StatusCode = 1;
            status.StatusMessage = "Order created successfully";
            return status;
        }

        public async Task<StatusModel> OrderAllItemsCart(OrderDto dto)
        {
            var status = new StatusModel();
            var productIds = await _dbContext.Cart.Where(i => i.UserId == dto.UserId).Select(i => i.ProductId).ToListAsync();
            if (productIds == null || productIds.Count < 1)
            {
                status.StatusCode = 0;
                status.StatusMessage = "No products found";
                return status;
            }

            var products = await _dbContext.Product.Where(i => productIds.Contains(i.Id)).ToListAsync();
            if (products == null || products.Count < 1)
            {
                status.StatusCode = 0;
                status.StatusMessage = "No products found";
                return status;
            }

            var order = new OrderModel
            {
                UserId = dto.UserId,
                UserName = dto.UserName,
                UserPhone = dto.UserPhone,
                UserEmail = dto.UserEmail,
                City = dto.City,
                Street = dto.Street,
                House = dto.House,
                Flat = dto.Flat,
                PaymentMethod = dto.PaymentMethod,
                OrderTime = DateTime.Now.Date,
                OrderComment = string.IsNullOrEmpty(dto.OrderComment) ? string.Empty : dto.OrderComment
            };

            var totalOrderPrice = products.Sum(product => product.Price);
            var orderList = products.Select(product =>
            {
                order.ProductId = product.Id;
                order.ProductPrice = product.Price;
                order.OrderTime = DateTime.Now.Date;
                return order;
            }).ToList();

            var messageBody = MessageBodyOrder(orderList.First(), "All products in cart", totalOrderPrice);
            status = await _sendEmail.SendEmail(dto.UserEmail, messageBody, "Order");
            if (status.StatusCode == 0)
            {
                return status;
            }

            await _dbContext.Order.AddRangeAsync(orderList);
            await _dbContext.SaveChangesAsync();

            status.StatusCode = 1;
            status.StatusMessage = "Orders created successfully";
            return status;
        }

        public async Task<(int countPages, List<PurchasesHistoryDto> orders)> OrderList(int userId, int currentPage)
        {
            var orders = _dbContext.Order
                .Where(i => i.UserId == userId)
                .Include(i => i.Product)
                .AsQueryable();

            if (orders == null || orders.Count() < 1)
            {
                return (0, null);
            }

            var ordersList = await orders.Select((item, index) => new PurchasesHistoryDto
            {
                OrderId = index + 1,
                OrderTime = item.OrderTime.Date,
                ProductName = item.Product.Name,
                ProductPrice = item.ProductPrice,
                ProductImg = item.Product.Img
            }).ToListAsync();


            var countPages = (int)Math.Ceiling(ordersList.Count / (double)ConstParameters.LIMIN_ORDERS_ONE_PAGE);
            var start = ConstParameters.LIMIN_ORDERS_ONE_PAGE * (currentPage - 1);
            ordersList = ordersList.Skip(start).Take(ConstParameters.LIMIN_ORDERS_ONE_PAGE).ToList();

            return (countPages, ordersList);
        }

        public string MessageBodyOrder(OrderModel model, string productName, int productPrice)
        {
            var messageBody = $"<div>Order from {model.OrderTime}</div>" +
                          $"<div>City: {model.City}, Street: {model.Street} {model.House} - {model.Flat}</div> " +
                          $"<div>Product: {productName}</div>" +
                          $"<div>Price: {productPrice}$</div>";

            return messageBody;
        }
    }
}
