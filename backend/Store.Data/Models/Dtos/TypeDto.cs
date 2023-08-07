using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

#pragma warning disable CS8618

namespace Store.Data.Models.Dtos
{
    public class TypeDto
    {
        public int TypeId { get; set; }
        public int[] BrandsId { get; set; }
        public int CurrentPage { get; set; }
    }
}
