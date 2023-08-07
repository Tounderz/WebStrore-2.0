using System;
using System.Collections.Generic;
using System.Drawing;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

#pragma warning disable CS8618

namespace Store.Data.Models.Dtos
{
    public class CategoryDto
    {
        public int Id { set; get; }
        public string Name { set; get; }
        public string ShortDescription { get; set; }
        public string Info { get; set; }
        public int[] BrandsId { get; set; }
        public IFormFile Img { get; set; }
        public int CountView { get; set; }
    }
}
