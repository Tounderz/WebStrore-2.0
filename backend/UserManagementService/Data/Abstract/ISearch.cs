using UserManagementService.Models.DTO;
using UserManagementService.Models;

namespace UserManagementService.Data.Abstract
{
    public interface ISearch
    {
        Task<List<UserModel>?> ResaultSearchUsers(string parameter, string criterie);
        Task<(int countPages, List<RoleModel> roles)> SearchRoles(string parameter, string criterie, int currentPage);
        Task<(int countPages, List<GenderModel> genders)> SearchGenders(string parameter, string criterie, int currentPage);
    }
}
