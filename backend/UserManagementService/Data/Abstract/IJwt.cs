using System.IdentityModel.Tokens.Jwt;
using UserManagementService.Models;

namespace UserManagementService.Data.Abstract
{
    public interface IJwt
    {
        string GenerateJwt(string login, string email, string role);
        JwtSecurityToken Verify(string jwtToken);
        Task<string> GenerateRefreshToken(int userId);
        Task<RefreshTokenModel> GetRefreshToken(int userId);
    }
}
