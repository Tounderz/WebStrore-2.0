using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

#pragma warning disable CS8618

namespace Store.Data.Models
{
    public class TypeModel
    {
        public int Id { get; set; }
        public int CategoryId { get; set; }
        public string Name { get; set; }
        public virtual CategoryModel Category { get; set; }
    }
}
