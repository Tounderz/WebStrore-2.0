using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UserManagementService.Models;
using UserManagementService.Models.DTO;

namespace UserManagementService.Data.Abstract
{
    public interface IRole
    {
        Task<RoleModel?> GetRoleById(int roleId);
        Task<List<RoleModel>?> GetAllRoles();
        Task<(int countPages, List<RoleModel> roles)> GetTableRoles(int currentPage);
        Task<StatusModel> Create(RoleModel role);
        Task<StatusModel> Edit(RoleModel role);
        Task<StatusModel> Delete(int roleId);
        Task<StatusModel> ReplaceRoleWithUsers(ReplaceRoleDto dto);
        Task<StatusModel> IsRoleNameAvailable(string roleName);
    }
}
