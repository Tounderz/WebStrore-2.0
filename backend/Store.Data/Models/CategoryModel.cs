using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

#pragma warning disable CS8618

#pragma warning disable CS8618

namespace Store.Data.Models
{
    public class CategoryModel
    {
        public int Id { set; get; }
        public string Name { set; get; }
        public string Img { get; set; }
        public string ShortDescription { get; set; }
        public string Info { get; set; }
        public int CountView { get; set; }
    }
}
