using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

#pragma warning disable CS8618

namespace Store.Data.Models.Dtos
{
    public class ProductDto
    {
        public int Id { get; set; }
        public int BrandId { get; set; }
        public int CategoryId { get; set; }
        public int TypeId { get; set; }
        public string Name { get; set; }
        public string ShortDescription { get; set; }
        public IFormFile Img { get; set; }
        public int Price { get; set; }
        public string IsFavourite { set; get; }
        public string Available { set; get; }
        public int CountView { get; set; }
    }
}
