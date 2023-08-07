using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UserManagementService.Models;
using UserManagementService.Models.DTO;

namespace UserManagementService.Data.Abstract
{
    public interface IUser
    {
        Task<UserModel> GetUserById(int id);
        Task<UserModel> GetUserByLogin(string login);
        Task<UserModel> GetUserByEmail(string email);
        Task<List<UserModel>> GetAllUsers();
        (int countPages, List<UserModel> users) GetUserTable(List<UserModel> users, int currentPage);
        Task<StatusModel> SignUp(RegisterDto dto);
        Task<StatusModel> Edit(RegisterDto dto);
        Task<StatusModel> Delete(int userId);
        Task<StatusModel> EditPassword(EditPasswordDto dto);
        Task<StatusModel> EditImg(int userId, IFormFile img);
        Task<StatusModel> IsLoginAvailable(string login, int userId);
        Task<StatusModel> IsEmailAvailable(string email, int userId);
    }
}
