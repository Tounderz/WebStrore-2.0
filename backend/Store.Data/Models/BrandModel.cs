using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

#pragma warning disable CS8618

namespace Store.Data.Models
{
    public class BrandModel
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Img { get; set; }
        public string Info { get; set; }
        public int CountView { get; set; }
    }
}
