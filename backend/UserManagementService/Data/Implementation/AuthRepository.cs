using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using UserManagementService.Data.Abstract;
using UserManagementService.Models;
using UserManagementService.Models.DTO;

#pragma warning disable CS8602

namespace UserManagementService.Data.Implementation
{
    public class AuthRepository : IAuth
    {
        private readonly UserDBContext _dbContext;

        public AuthRepository(UserDBContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<(StatusModel status, UserModel? user)> SignIn(LoginDto dto)
        {
            var status = new StatusModel();
            var user = await _dbContext.User.FirstOrDefaultAsync(i => i.Login ==  dto.Login);
            if (user == null)
            {
                status.StatusCode = 0;
                status.StatusMessage = "User not found";
                return (status, null);
            }

            if (!BCrypt.Net.BCrypt.Verify(dto.Password, user.Password))
            {
                status.StatusCode = 0;
                status.StatusMessage = "Invalid password";
                return (status, null);
            }

            if (!user.IsConfirmEmail)
            {
                status.StatusCode = 0;
                status.StatusMessage = "Email not confirmed";
                return (status, user);
            }

            if (user.IsDeleted)
            {
                status.StatusCode = 0;
                status.StatusMessage = "User account deleted";
                return (status, user);
            }

            status.StatusCode = 1;
            status.StatusMessage = "Sign in successful";
            return (status, user);
        }

        public async Task<UserModel?> GetByUserFromToken(JwtSecurityToken token)
        {
            var user = new UserModel();
            foreach (var item in token.Claims)
            {
                if (item.Type == ClaimTypes.NameIdentifier)
                {
                    user = await _dbContext.User.FirstOrDefaultAsync(i => i.Login == item.Value);
                    break;
                }
            }

            if (user == null)
            {
                return null;
            }

            return user;
        }

        public UserResponseDto CreateUserResponseModel(UserModel user, string roleName)
        {
            var responseUser = new UserResponseDto
            {
                Id = user.Id,
                Login = user.Login,
                IsAuth = true,
                Role = roleName
            };

            return responseUser;
        }
    }
}
