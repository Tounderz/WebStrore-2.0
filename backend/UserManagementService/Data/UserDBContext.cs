using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UserManagementService.Models;

#pragma warning disable CS8618

namespace UserManagementService.Data
{
    public class UserDBContext : DbContext
    {
        public UserDBContext(DbContextOptions<UserDBContext> options) :
            base(options)
        {
        }

        public DbSet<GenderModel> Gender { get; set; }
        public DbSet<RoleModel> Role { get; set; }
        public DbSet<UserModel> User { get; set; }
        public DbSet<AccountRecoveryModel> AccountDeletion { get; set; }
        public DbSet<PasswordRecoveryModel> PasswordRecovery { get; set; }
        public DbSet<RefreshTokenModel> RefreshToken { get; set; }
        public DbSet<ConfirmEmailModel> ConfirmEmail { get; set; }
    }
}
