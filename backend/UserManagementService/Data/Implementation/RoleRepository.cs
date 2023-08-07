using Microsoft.EntityFrameworkCore;
using MimeKit;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UserManagementService.Constants;
using UserManagementService.Data.Abstract;
using UserManagementService.Models;
using UserManagementService.Models.DTO;

#pragma warning disable CS8619

namespace UserManagementService.Data.Implementation
{
    public class RoleRepository : IRole
    {
        private readonly UserDBContext _dbContext;

        public RoleRepository(UserDBContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<RoleModel?> GetRoleById(int roleId)
        {
            var role = await _dbContext.Role.FirstOrDefaultAsync(i => i.Id == roleId);
            if (role == null)
            {
                return null;
            }

            return role;
        }

        public async Task<List<RoleModel>?> GetAllRoles()
        {
            var roles = await _dbContext.Role.ToListAsync();
            if (roles == null || roles.Count <= 0)
            {
                return null;
            }

            return roles;
        }

        public async Task<(int countPages, List<RoleModel> roles)> GetTableRoles(int currentPage)
        {
            var roles = await _dbContext.Role.ToListAsync();
            if (roles == null || roles.Count < 1)
            {
                return (0, null);
            }

            var countPages = (int)Math.Ceiling(roles.Count / (double)ConstParameter.LIMIT_TABLE_ONE_PAGE);
            var start = ConstParameter.LIMIT_TABLE_ONE_PAGE * (currentPage - 1);
            roles = roles.Skip(start).Take(ConstParameter.LIMIT_TABLE_ONE_PAGE).ToList();

            return (countPages, roles);
        }

        public async Task<StatusModel> Create(RoleModel role)
        {
            var status = new StatusModel();
            var model = new RoleModel
            {
                RoleName = role.RoleName
            };

            await _dbContext.Role.AddAsync(model);
            await _dbContext.SaveChangesAsync();

            status.StatusCode = 1;
            status.StatusMessage = "Role created successfully.";
            return status;
        }

        public async Task<StatusModel> Edit(RoleModel role)
        {
            var status = new StatusModel();

            var model = await _dbContext.Role.FirstOrDefaultAsync(i => i.Id != role.Id);
            if (model == null)
            {
                status.StatusCode = 0;
                status.StatusMessage = "Role not found.";
                return status;
            }

            model.RoleName = role.RoleName;

            _dbContext.Role.Update(model);
            await _dbContext.SaveChangesAsync();

            status.StatusCode = 1;
            status.StatusMessage = "Role updated successfully.";
            return status;
        }

        public async Task<StatusModel> Delete(int roleId)
        {
            var status = new StatusModel();
            var role = await _dbContext.Role.FirstOrDefaultAsync(i => i.Id == roleId);
            if (role == null)
            {
                status.StatusCode = 0;
                status.StatusMessage = "Role not found.";
                return status;
            }

            var users = await _dbContext.User.Where(i => i.RoleId == roleId).ToListAsync();
            if (users.Count > 0)
            {
                status.StatusCode = 0;
                status.StatusMessage = "Cannot delete role. There are users associated with this role.";
                return status;
            }

            _dbContext.Role.Remove(role);
            await _dbContext.SaveChangesAsync();

            status.StatusCode = 1;
            status.StatusMessage = "Role deleted successfully.";
            return status;
        }

        public async Task<StatusModel> ReplaceRoleWithUsers(ReplaceRoleDto dto)
        {
            var status = new StatusModel();

            // Получаем общую роль
            var commonRole = await _dbContext.Role.FirstOrDefaultAsync(r => r.RoleName == dto.CurrentRoleName);
            if (commonRole == null)
            {
                status.StatusCode = 0;
                status.StatusMessage = "Common role not found.";
                return status;
            }

            // Получаем новую роль
            var newRole = await _dbContext.Role.FirstOrDefaultAsync(r => r.RoleName == dto.NewRoleName);
            if (newRole == null)
            {
                status.StatusCode = 0;
                status.StatusMessage = "New role not found.";
                return status;
            }

            // Обновляем роль для пользователей с общей ролью
            var usersToUpdate = await _dbContext.User.Where(u => u.RoleId == commonRole.Id).ToListAsync();
            if (usersToUpdate.Count == 0)
            {
                status.StatusCode = 0;
                status.StatusMessage = "No users with the common role found.";
                return status;
            }

            foreach (var user in usersToUpdate)
            {
                user.RoleId = newRole.Id;
                _dbContext.User.Update(user);
            }

            await _dbContext.SaveChangesAsync();

            status.StatusCode = 1;
            status.StatusMessage = "Role replaced successfully.";
            return status;
        }

        public async Task<StatusModel> IsRoleNameAvailable(string roleName)
        {
            var status = new StatusModel();
            var role = await _dbContext.Role.FirstOrDefaultAsync(i => i.RoleName.ToLower() == roleName.ToLower());
            if (role != null)
            {
                status.StatusCode = 0;
                status.StatusMessage = "Role name is not available.";
                return status;
            }

            status.StatusCode = 1;
            status.StatusMessage = "Role name is available.";
            return status;
        }
    }
}
