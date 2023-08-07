using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

#pragma warning disable CS8618

namespace UserManagementService.Models.DTO
{
    public class RegisterDto
    {
        public int UserId { get; set; }
        public string Name { get; set; }
        public string? LastName { get; set; }
        public int GenderId { get; set; }
        public DateTime DateOfBirth { get; set; }
        public string Email { get; set; }
        public string? Phone { get; set; }
        public string Login { get; set; }
        public string Password { get; set; }
        public int RoleId { get; set; }
        public IFormFile? Img { get; set; }
        public string ConfirmEmail { get; set; }
        public string IsDeleted { get; set; }
    }
}
