using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

#pragma warning disable CS8618

namespace Store.Data.Models
{
    public class ProductModel
    {
        public int Id { get; set; }
        public int BrandId { get; set; }
        public int CategoryId { get; set; }
        public int TypeId { get; set; }
        public string Name { get; set; }
        public string ShortDescription { get; set; }
        public string Img { get; set; }
        public int Price { get; set; }
        public bool IsFavourite { set; get; } // есть значение true отображается на главной странице(лучшие товары), false не будет отобращаться
        public bool Available { set; get; } // есть ли в наличии и кол-во
        public int CountView { get; set; }
        public virtual BrandModel Brand { get; set; }
        public virtual CategoryModel Category { get; set; }
        public virtual TypeModel Type { get; set; }
    }
}
