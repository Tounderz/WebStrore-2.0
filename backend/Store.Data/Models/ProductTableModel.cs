using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

#pragma warning disable CS8618

namespace Store.Data.Models
{
    public class ProductTableModel
    {
        public int Id { get; set; }
        public string BrandName { get; set; }
        public string CategoryName { get; set; }
        public string TypeName { get; set; }
        public string Name { get; set; }
        public string ShortDescription { get; set; }
        public string Img { get; set; }
        public int Price { get; set; }
        public string Available { set; get; }
        public int CountView { get; set; }
    }
}
