using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

#pragma warning disable CS8618

namespace Store.Data.Models
{
    public class CategoriesBrandsModel
    {
        public int Id { get; set; }
        public int CategoryId { get; set; }
        public int BrandId { get; set; }
        public virtual CategoryModel Category { get; set; }
        public virtual BrandModel Brand { get; set; }
    }
}
