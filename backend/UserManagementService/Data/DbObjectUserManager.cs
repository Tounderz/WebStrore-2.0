using BCrypt.Net;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UserManagementService.Models;

#pragma warning disable CS8602

namespace UserManagementService.Data
{
    public class DbObjectUserManager
    {
        public async static Task InitialRole(UserDBContext context)
        {
            if (!context.Role.Any())
            {
                var roles = new List<RoleModel>()
                { 
                    new RoleModel
                    {
                        RoleName = "admin"
                    },
                    new RoleModel
                    {
                        RoleName = "moderator"
                    },
                    new RoleModel
                    {
                        RoleName = "user"
                    }
                };

                await context.Role.AddRangeAsync(roles);
                await context.SaveChangesAsync();
            }
        }

        public async static Task InitialGender(UserDBContext context)
        {
            if (!context.Gender.Any())
            {
                var genders = new List<GenderModel>()
                {
                    new GenderModel
                    {
                        GenderName = "man"
                    },
                    new GenderModel
                    {
                        GenderName = "woman"
                    }
                };

                await context.Gender.AddRangeAsync(genders);
                await context.SaveChangesAsync();
            }
        }

        public async static Task InitialAdmin(UserDBContext context)
        {
            if (!context.User.Any())
            {
                var admin = new UserModel()
                {
                    Name = "admin",
                    LastName = string.Empty,
                    GenderId = context.Gender.FirstOrDefault(i => i.GenderName == "man").Id,
                    DateOfBirth = new DateTime(1990, 1, 1),
                    Phone = "+357299878787",
                    Email = "admin@mail.ru",
                    Login = "admin",
                    Password = BCrypt.Net.BCrypt.HashPassword("123456"),
                    RoleId = context.Role.FirstOrDefault(i => i.RoleName == "admin").Id,
                    IsConfirmEmail = true,
                    IsDeleted = false,
                    Img = string.Empty,
                    
                };

                await context.User.AddAsync(admin);
                await context.SaveChangesAsync();
            }
        }
    }
}
