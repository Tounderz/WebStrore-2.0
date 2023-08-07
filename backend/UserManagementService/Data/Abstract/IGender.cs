using UserManagementService.Models;
using UserManagementService.Models.DTO;

namespace UserManagementService.Data.Abstract
{
    public interface IGender
    {
        Task<GenderModel?> GetGenderById(int genderId);
        Task<List<GenderModel>?> GetAllGenders();
        Task<(int countPages, List<GenderModel> genders)> GetTableGenders(int currentPage);
        Task<StatusModel> Create(GenderModel model);
        Task<StatusModel> Edit(GenderModel model);
        Task<StatusModel> Delete(int genderId);
        Task<StatusModel> ReplaceGenderWithUsers(ReplaceGenderDto dto);
        Task<StatusModel> IsGenderNameAvailable(string genderName);
    }
}
