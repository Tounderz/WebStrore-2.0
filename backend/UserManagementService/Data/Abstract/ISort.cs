using UserManagementService.Models.DTO;
using UserManagementService.Models;

namespace UserManagementService.Data.Abstract
{
    public interface ISort
    {
        Task<List<UserModel>> SortUsers(string propertyTitle, string typeSort);
        Task<(int countPages, List<RoleModel> roles)> SortRoles(string propertyTitle, string typeSort, int currentPage);
        Task<(int countPages, List<GenderModel> genders)> SortGenders(string propertyTitle, string typeSort, int currentPage);
    }
}
