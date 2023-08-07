using Microsoft.EntityFrameworkCore;
using System.Data;
using UserManagementService.Constants;
using UserManagementService.Data.Abstract;
using UserManagementService.Models;

#pragma warning disable CS8603
#pragma warning disable CS8619

namespace UserManagementService.Data.Implementation
{
    public class SortRepository : ISort
    {
        private readonly UserDBContext _dbContext;
        private readonly string down = "down";

        public SortRepository(UserDBContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<List<UserModel>> SortUsers(string propertyTitle, string typeSort)
        {
            var users = await _dbContext.User
                .Include(i => i.Role)
                .Include(i => i.Gender)
                .ToListAsync();

            if (users == null || users.Count == 0)
            {
                return null;
            }

            switch (propertyTitle)
            {
                case ConstPropertyName.ID:
                    users = typeSort.Equals(down, StringComparison.OrdinalIgnoreCase)
                       ? users.OrderByDescending(i => i.Id).ToList()
                       : users.OrderBy(i => i.Id).ToList();
                    break;
                case ConstPropertyName.NAME:
                    users = typeSort.Equals(down, StringComparison.OrdinalIgnoreCase)
                       ? users.OrderByDescending(i => i.Name).ToList()
                       : users.OrderBy(i => i.Name).ToList();
                    break;
                case ConstPropertyName.LASTNAME:
                    users = typeSort.Equals(down, StringComparison.OrdinalIgnoreCase)
                       ? users.OrderByDescending(i => i.LastName).ToList()
                       : users.OrderBy(i => i.LastName).ToList();
                    break;
                case ConstPropertyName.GENDER:
                    users = typeSort.Equals(down, StringComparison.OrdinalIgnoreCase)
                       ? users.OrderByDescending(i => i.Gender.GenderName).ToList()
                       : users.OrderBy(i => i.Gender.GenderName).ToList();
                    break;
                case ConstPropertyName.DATE_OF_BIRTH:
                    users = typeSort.Equals(down, StringComparison.OrdinalIgnoreCase)
                       ? users.OrderByDescending(i => i.DateOfBirth).ToList()
                       : users.OrderBy(i => i.DateOfBirth).ToList();
                    break;
                case ConstPropertyName.EMAIL:
                    users = typeSort.Equals(down, StringComparison.OrdinalIgnoreCase)
                       ? users.OrderByDescending(i => i.Email).ToList()
                       : users.OrderBy(i => i.Email).ToList();
                    break;
                case ConstPropertyName.PHONE:
                    users = typeSort.Equals(down, StringComparison.OrdinalIgnoreCase)
                      ? users.OrderByDescending(i => i.Phone).ToList()
                      : users.OrderBy(i => i.Phone).ToList();
                    break;
                case ConstPropertyName.LOGIN:
                    users = typeSort.Equals(down, StringComparison.OrdinalIgnoreCase)
                     ? users.OrderByDescending(i => i.Login).ToList()
                     : users.OrderBy(i => i.Login).ToList();
                    break;
                case ConstPropertyName.ROLE:
                    users = typeSort.Equals(down, StringComparison.OrdinalIgnoreCase)
                       ? users.OrderByDescending(i => i.Role.RoleName).ToList()
                       : users.OrderBy(i => i.Role.RoleName).ToList();
                    break;
                case ConstPropertyName.IS_CONFIRM_EMAIL:
                    users = typeSort.Equals(down, StringComparison.OrdinalIgnoreCase)
                     ? users.OrderByDescending(i => i.IsConfirmEmail).ToList()
                     : users.OrderBy(i => i.IsConfirmEmail).ToList();
                    break;
                case ConstPropertyName.IS_DELETED:
                    users = typeSort.Equals(down, StringComparison.OrdinalIgnoreCase)
                     ? users.OrderByDescending(i => i.IsDeleted).ToList()
                     : users.OrderBy(i => i.IsDeleted).ToList();
                    break;
                default:
                    break;
            }

            return users;
        }

        public async Task<(int countPages, List<RoleModel> roles)> SortRoles(string propertyTitle, string typeSort, int currentPage)
        {
            var roles = await _dbContext.Role.ToListAsync();
            if (roles == null || roles.Count == 0)
            {
                return (0, null);
            }

            switch (propertyTitle)
            {
                case ConstPropertyName.ID:
                    roles = typeSort.Equals(down, StringComparison.OrdinalIgnoreCase)
                        ? roles.OrderByDescending(i => i.Id).ToList()
                        : roles.OrderBy(i => i.Id).ToList();
                    break;
                case ConstPropertyName.NAME:
                    roles = typeSort.Equals(down, StringComparison.OrdinalIgnoreCase)
                        ? roles.OrderByDescending(i => i.RoleName).ToList()
                                : roles.OrderBy(i => i.RoleName).ToList();
                    break;
                default:
                    break;
            }

            var countPages = (int)Math.Ceiling(roles.Count / (double)12);
            var start = 12 * (currentPage - 1);
            roles = roles.Skip(start).Take(12).ToList();

            return (countPages, roles);
        }

        public async Task<(int countPages, List<GenderModel> genders)> SortGenders(string propertyTitle, string typeSort, int currentPage)
        {
            var genders = await _dbContext.Gender.ToListAsync();
            if (genders == null || genders.Count == 0)
            {
                return (0, null);
            }

            switch (propertyTitle)
            {
                case ConstPropertyName.ID:
                    genders = typeSort.Equals(down, StringComparison.OrdinalIgnoreCase)
                        ? genders.OrderByDescending(i => i.Id).ToList()
                        : genders.OrderBy(i => i.Id).ToList();
                    break;
                case ConstPropertyName.NAME:
                    genders = typeSort.Equals(down, StringComparison.OrdinalIgnoreCase)
                        ? genders.OrderByDescending(i => i.GenderName).ToList()
                                : genders.OrderBy(i => i.GenderName).ToList();
                    break;
                default:
                    break;
            }

            var countPages = (int)Math.Ceiling(genders.Count / (double)12);
            var start = 12 * (currentPage - 1);
            genders = genders.Skip(start).Take(12).ToList();

            return (countPages, genders);
        }
    }
}
