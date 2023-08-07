using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UserManagementService.Models;
using UserManagementService.Models.DTO;

namespace UserManagementService.Data.Abstract
{
    public interface IAuth
    {
        Task<(StatusModel status, UserModel? user)> SignIn(LoginDto dto);
        Task<UserModel?> GetByUserFromToken(JwtSecurityToken token);
        UserResponseDto CreateUserResponseModel(UserModel user, string roleName);
    }
}
