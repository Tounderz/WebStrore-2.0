using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

#pragma warning disable CS8618

namespace UserManagementService.Models.DTO
{
    public class UserResponseDto
    {
        public int Id { get; set; }
        public string Login { get; set; }
        public string Role { get; set; }
        public bool IsAuth { get; set; }
    }
}
