using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Store.Data.Models.Dtos
{
    public class CartDto
    {
        public int ProductId { get; set; }
        public int UserId { get; set; }
        public int CurrentPage { get; set; }
    }
}
