using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

#pragma warning disable CS8618

namespace Store.Data.Models
{
    public class OrderModel
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public int ProductId { get; set; }
        public int ProductPrice { get; set; }
        public string UserName { get; set; }
        public string UserPhone { get; set; }
        public string UserEmail { get; set; }
        public string City { get; set; }
        public string Street { get; set; }
        public int House { get; set; }
        public int Flat { get; set; }
        public string OrderComment { get; set; }
        public string PaymentMethod { get; set; }
        public DateTime OrderTime { get; set; }
        public virtual ProductModel Product { get; set; }
    }
}
