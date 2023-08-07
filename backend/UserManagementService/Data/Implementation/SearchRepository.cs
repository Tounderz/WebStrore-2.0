using Microsoft.EntityFrameworkCore;
using UserManagementService.Data.Abstract;
using UserManagementService.Models;
using UserManagementService.Constants;

#pragma warning disable CS8602
#pragma warning disable CS8619

namespace UserManagementService.Data.Implementation
{
    public class SearchRepository : ISearch
    {
        private readonly UserDBContext _dbContext;

        public SearchRepository(UserDBContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<List<UserModel>?> ResaultSearchUsers(string parameter, string criterie)
        {
            var users = new List<UserModel>();
            switch (criterie)
            {
                case ConstPropertyName.ID:
                    var user = await _dbContext.User.FirstOrDefaultAsync(i => i.Id == int.Parse(parameter));
                    if (user == null)
                    {
                        return null;
                    }

                    users.Add(user);
                    break;
                case ConstPropertyName.NAME:
                    users = await _dbContext.User.Where(i => i.Name.Contains(parameter)).ToListAsync();
                    break;
                case ConstPropertyName.LASTNAME:
                    users = await _dbContext.User.Where(i => i.LastName.Contains(parameter)).ToListAsync();
                    break;
                case ConstPropertyName.EMAIL:
                    users = await _dbContext.User.Where(i => i.Email.Contains(parameter)).ToListAsync();
                    break;
                case ConstPropertyName.LOGIN:
                    users = await _dbContext.User.Where(i => i.Login.Contains(parameter)).ToListAsync();
                    break;
                case ConstPropertyName.GENDER:
                    var gender = await _dbContext.Gender.FirstOrDefaultAsync(i => i.GenderName.ToLower() == parameter.ToLower());
                    users = gender != null ? await _dbContext.User.Where(i => i.GenderId == gender.Id).ToListAsync() : null;
                    if (users == null || users.Count <= 0)
                    {
                        return null;
                    }
                    break;
                case ConstPropertyName.ROLE:
                    var role = await _dbContext.Role.FirstOrDefaultAsync(i => i.RoleName.ToLower() == parameter.ToLower());
                    users = role != null ? await _dbContext.User.Where(i => i.GenderId == role.Id).ToListAsync() : null;
                    if (users == null || users.Count <= 0)
                    {
                        return null;
                    }
                    break;
                case ConstPropertyName.PHONE:
                    users = await _dbContext.User.Where(i => i.Phone.Contains(parameter)).ToListAsync();
                    break;
                default:
                    break;
            };

            if (users == null || users.Count <= 0)
            {
                return null;
            }

            return users;
        }

        public async Task<(int countPages, List<RoleModel> roles)> SearchRoles(string parameter, string criterie, int currentPage)
        {
            var roles = new List<RoleModel>();
            switch (criterie)
            {
                case ConstPropertyName.ID:
                    var role = await _dbContext.Role.FirstOrDefaultAsync(i => i.Id == int.Parse(parameter));
                    if (role == null)
                    {
                        return (0, null);
                    }

                    roles.Add(role);
                    break;
                case ConstPropertyName.NAME:
                    roles = await _dbContext.Role.
                        Where(i => i.RoleName.Contains(parameter))
                       .ToListAsync();
                    if (roles == null || roles.Count < 1)
                    {
                        return (0, null);
                    }
                    break;
                default: 
                    break;
            }

            var countPages = (int)Math.Ceiling(roles.Count / (double)ConstParameter.LIMIT_TABLE_ONE_PAGE);
            var start = ConstParameter.LIMIT_TABLE_ONE_PAGE * (currentPage - 1);
            roles = roles.Skip(start).Take(ConstParameter.LIMIT_TABLE_ONE_PAGE).ToList();

            return (countPages, roles);
        }

        public async Task<(int countPages, List<GenderModel> genders)> SearchGenders(string parameter, string criterie, int currentPage)
        {
            var genders = new List<GenderModel>();
            switch (criterie)
            {
                case ConstPropertyName.ID:
                    var gender = await _dbContext.Gender.FirstOrDefaultAsync(i => i.Id == int.Parse(parameter));
                    if (gender == null)
                    {
                        return (0, null);
                    }

                    genders.Add(gender);
                    break;
                case ConstPropertyName.NAME:
                    genders = await _dbContext.Gender.
                        Where(i => i.GenderName.Contains(parameter))
                       .ToListAsync();
                    if (genders == null || genders.Count < 1)
                    {
                        return (0, null);
                    }
                    break;
                default:
                    break;
            }

            var countPages = (int)Math.Ceiling(genders.Count / (double)ConstParameter.LIMIT_TABLE_ONE_PAGE);
            var start = ConstParameter.LIMIT_TABLE_ONE_PAGE * (currentPage - 1);
            genders = genders.Skip(start).Take(ConstParameter.LIMIT_TABLE_ONE_PAGE).ToList();

            return (countPages, genders);
        }
    }
}
