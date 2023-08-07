using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

#pragma warning disable CS8618

namespace Store.Data.Models.Dtos
{
    public class BrandDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Info { get; set; }
        public int[] CategoriesId { get; set; }
        public IFormFile Img { get; set; }
        public int CountView { get; set; }
    }
}
