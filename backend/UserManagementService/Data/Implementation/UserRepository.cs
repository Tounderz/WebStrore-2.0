using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UserManagementService.Data.Abstract;
using Microsoft.EntityFrameworkCore;
using System.Numerics;
using System.Xml.Linq;
using UserManagementService.Models;
using UserManagementService.Models.DTO;

#pragma warning disable CS8602
#pragma warning disable CS8603

namespace UserManagementService.Data.Implementation
{
    public class UserRepository : IUser
    {
        private readonly UserDBContext _dbContext;
        private readonly ISaveImg _saveImg;
        private readonly IAccountRecovery _accountRecovery;

        public UserRepository(UserDBContext dbContext, ISaveImg saveImg, IAccountRecovery accountRecovery)
        {
            _dbContext = dbContext;
            _saveImg = saveImg;
            _accountRecovery = accountRecovery;
        }

        public async Task<UserModel> GetUserById(int id)
        {
            var user = await _dbContext.User.FirstOrDefaultAsync(i => i.Id == id);
            if (user == null)
            {
                return null;
            }

            return user;
        }

        public async Task<UserModel> GetUserByLogin(string login)
        {
            var user = await _dbContext.User.FirstOrDefaultAsync(i => i.Login == login);
            if (user == null)
            {
                return null;
            }

            return user;
        }

        public async Task<UserModel> GetUserByEmail(string email)
        {
            var user = await _dbContext.User.FirstOrDefaultAsync(i => i.Email == email);
            if (user == null)
            {
                return null;
            }

            return user;
        }

        public async Task<List<UserModel>> GetAllUsers()
        {
            var users = await _dbContext.User.ToListAsync();
            if (users == null || users.Count == 0)
            {
                return null;
            }

            return users;
        }

        public (int countPages, List<UserModel> users) GetUserTable(List<UserModel> users, int currentPage)
        {
            decimal count = users.Count;
            var countPages = Convert.ToInt32(Math.Ceiling(count / 10));
            int start = 10 * (currentPage - 1);
            users = users.Skip(start).Take(10).ToList();

            return (countPages, users);
        }

        public async Task<StatusModel> SignUp(RegisterDto dto)
        {
            var status = await IsEmailAvailable(dto.Email, 0);
            var userRole = await _dbContext.Role.FirstOrDefaultAsync(i => i.RoleName == "user");
            var user = new UserModel
            {
                Name = !string.IsNullOrEmpty(dto.Name) ? dto.Name : string.Empty,
                LastName = !string.IsNullOrEmpty(dto.LastName) ? dto.LastName : string.Empty,
                GenderId = dto.GenderId,
                DateOfBirth = dto.DateOfBirth != DateTime.MinValue ? dto.DateOfBirth.Date : DateTime.MinValue.Date,
                Email = dto.Email,
                Phone = !string.IsNullOrEmpty(dto.Phone) ? dto.Phone : string.Empty,
                Login = dto.Login,
                Password = BCrypt.Net.BCrypt.HashPassword(dto.Password),
                RoleId = userRole.Id,
                Img = dto.Img != null ? await _saveImg.SaveImg(dto.Img) : string.Empty,
                IsConfirmEmail = false,
                IsDeleted = false
            };

            
            if (string.IsNullOrEmpty(user.Password))
            {
                status.StatusCode = 0;
                status.StatusMessage = "Invalid password";
                return status;
            }

            await _dbContext.AddAsync(user);
            await _dbContext.SaveChangesAsync();

            status.StatusCode = 1;
            status.StatusMessage = "The user is successfully registered";
            return status;
        }

        public async Task<StatusModel> Edit(RegisterDto dto)
        {
            var status = new StatusModel();
            var user = await _dbContext.User.FirstOrDefaultAsync(i => i.Id == dto.UserId);
            if (user == null)
            {
                status.StatusCode = 0;
                status.StatusMessage = "User not found";
                return status;
            }

            if (user.IsDeleted && !bool.Parse(dto.IsDeleted))
            {
                status = await _accountRecovery.AccountRecoveryByAdmin(user.Id);
                if (status.StatusCode == 0)
                {
                    return status;
                }

                user.IsDeleted = false;
            }

            user.Name = dto.Name ?? user.Name;
            user.LastName = dto.LastName ?? user.LastName;
            user.GenderId = dto.GenderId != 0 ? dto.GenderId : user.GenderId;
            user.DateOfBirth = dto.DateOfBirth != DateTime.MinValue ? dto.DateOfBirth.Date : user.DateOfBirth;
            user.Email = dto.Email ?? user.Email;
            user.Phone = dto.Phone ?? user.Phone;
            user.Login = dto.Login ?? user.Login;
            user.RoleId = dto.RoleId != 0 ? dto.RoleId : user.RoleId;
            user.Img = dto.Img != null ? await _saveImg.SaveImg(dto.Img) : user.Img;
            user.IsConfirmEmail = !string.IsNullOrEmpty(dto.ConfirmEmail) ? bool.Parse(dto.ConfirmEmail) : user.IsConfirmEmail;

            _dbContext.Update(user);
            await _dbContext.SaveChangesAsync();

            status.StatusCode = 1;
            status.StatusMessage = "User data successfully updated";
            return status;
        }

        public async Task<StatusModel> Delete(int userId)
        {
            var status = new StatusModel();
            var user = await _dbContext.User.SingleOrDefaultAsync(i => i.Id == userId);
            if (user == null)
            {
                status.StatusCode = 0;
                status.StatusMessage = "User not found";
                return status;
            }

            user.IsDeleted = true;
            var accountDeletion = new AccountRecoveryModel
            {
                UserEmail = user.Email,
                RecoveryExpirationDate = DateTime.Now.AddMonths(6).Date,
                RestoringToken = Guid.NewGuid().ToString(),
                DateExpiresToken = DateTime.Now.Date
            };

            await _dbContext.AccountDeletion.AddAsync(accountDeletion);
            await _dbContext.SaveChangesAsync();
            status.StatusCode = 1;
            status.StatusMessage = "User deleted successfully";
            return status;
        }

        public async Task<StatusModel> EditPassword(EditPasswordDto dto)
        {
            var status = new StatusModel();
            var user = await _dbContext.User.FirstOrDefaultAsync(i => i.Id == dto.UserId);
            if (user == null)
            {
                status.StatusCode = 0;
                status.StatusMessage = "User not found";
                return status;
            }

            if (!string.IsNullOrEmpty(dto.CurrentPassword))
            {
                if (!BCrypt.Net.BCrypt.Verify(dto.CurrentPassword, user.Password))
                {
                    status.StatusCode = 0;
                    status.StatusMessage = "Invalid current password";
                    return status;
                }
            }

            if (BCrypt.Net.BCrypt.Verify(dto.NewPassword, user.Password))
            {
                status.StatusCode = 0;
                status.StatusMessage = "Invalid new password";
                return status;
            }

            user.Password = BCrypt.Net.BCrypt.HashPassword(dto.NewPassword);

            _dbContext.User.Update(user);
            await _dbContext.SaveChangesAsync();

            status.StatusCode = 1;
            status.StatusMessage = "Password successfully updated";
            return status;
        }

        public async Task<StatusModel> EditImg(int userId, IFormFile img)
        {
            var status = new StatusModel();
            var user = await _dbContext.User.FirstOrDefaultAsync(i => i.Id == userId);
            if (user == null)
            {
                status.StatusCode = 0;
                status.StatusMessage = "User not found";
                return status;
            }

            user.Img = await _saveImg.SaveImg(img);

            _dbContext.User.Update(user);
            await _dbContext.SaveChangesAsync();

            status.StatusCode = 1;
            status.StatusMessage = "Image successfully updated";
            return status;
        }

        public async Task<StatusModel> IsLoginAvailable(string login, int userId)
        {
            var status = new StatusModel();
            var userExists = await _dbContext.User.AnyAsync(i => i.Login == login && i.Id != userId);
            if (!userExists)
            {
                status.StatusCode = 1;
                status.StatusMessage = "The login is available";
                return status;
            }

            status.StatusCode = 0;
            status.StatusMessage = "The Login isn`t available";
            return status;
        }

        public async Task<StatusModel> IsEmailAvailable(string email, int userId)
        {
            var status = new StatusModel();
            var userExists = await _dbContext.User.AnyAsync(i => i.Email == email && i.Id != userId);
            if (!userExists)
            {
                status.StatusCode = 1;
                status.StatusMessage = "The Email is available";
                return status;
            }

            status.StatusCode = 0;
            status.StatusMessage = "The Email isn`t available";
            return status;
        }

      
    }
}
