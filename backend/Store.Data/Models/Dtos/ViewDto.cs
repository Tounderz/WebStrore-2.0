using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

#pragma warning disable CS8618

namespace Store.Data.Models.Dtos
{
    public class ViewDto
    {
        public int Id { get; set; }
        public string Role { get; set; }
        public int CurrentPage { get; set; }
    }
}
