using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Store.Data.Models.Dtos
{
    public class OrderDto
    {
        public int UserId { get; set; }
        public int ProductId { get; set; }
        public string UserName { get; set; }
        public string UserPhone { get; set; }
        public string UserEmail { get; set; }
        public string City { get; set; }
        public string Street { get; set; }
        public int House { get; set; }
        public int Flat { get; set; }
        public string OrderComment { get; set; }
        public string PaymentMethod { get; set; }
    }
}
