using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

#pragma warning disable CS8618

namespace Store.Data.Models.Dtos
{
    public class PurchasesHistoryDto
    {
        public int OrderId { get; set; }
        public DateTime OrderTime { get; set; }
        public string ProductName { get; set; }
        public int ProductPrice { get; set; }
        public string ProductImg { get; set; }
    }
}
