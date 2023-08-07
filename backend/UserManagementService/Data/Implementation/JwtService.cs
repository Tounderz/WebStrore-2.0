using UserManagementService.Data.Abstract;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using UserManagementService.Models.Configurations;
using UserManagementService.Models;

#pragma warning disable CS8603

namespace UserManagementService.Data.Implementation
{
    public class JwtService : IJwt
    {
        private readonly UserDBContext _dBContext;
        private readonly JWTConfiguration _jwtConfig;

        public JwtService(UserDBContext dBContext, JWTConfiguration jwtConfig)
        {
            _dBContext = dBContext;
            _jwtConfig = jwtConfig;
        }

        public string GenerateJwt(string login, string email, string role)
        {
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtConfig.Key));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, login),
                new Claim(ClaimTypes.Email, email),
                new Claim(ClaimTypes.Role, role)
            };

            var now = DateTime.Now;
            var securityToken = new JwtSecurityToken
                (
                    issuer: _jwtConfig.Issuer,
                    audience: _jwtConfig.Audience,
                    notBefore: now,
                    claims: claims,
                    expires: now.AddSeconds(20),
                    signingCredentials: credentials
                );

            var accessToken = new JwtSecurityTokenHandler().WriteToken(securityToken);

            return accessToken;
        }

        public JwtSecurityToken Verify(string jwtToken)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.UTF8.GetBytes(_jwtConfig.Key);
            tokenHandler.ValidateToken(jwtToken, new TokenValidationParameters
            {
                IssuerSigningKey = new SymmetricSecurityKey(key),
                ValidateIssuerSigningKey = true,
                ValidateIssuer = true,
                ValidateAudience = true,
                ValidIssuer = _jwtConfig.Issuer,
                ValidAudience = _jwtConfig.Audience,
            },
                out SecurityToken securityToken);

            var token = securityToken as JwtSecurityToken;

            return token;
        }

        public async Task<string> GenerateRefreshToken(int userId)
        {
            var randomNumber = new byte[64];
            using var randomNumberGenerator = RandomNumberGenerator.Create();
            randomNumberGenerator.GetBytes(randomNumber);
            var refreshToken = Convert.ToBase64String(randomNumber);
            var refreshTokenModel = await _dBContext.RefreshToken.FirstOrDefaultAsync(i => i.UserId == userId);
            if (refreshTokenModel != null)
            {
                var dateCompare = DateTime.Compare(refreshTokenModel.TokenExpires, DateTime.Now);
                if (dateCompare < 1)
                {
                    refreshTokenModel.Token = refreshToken;
                    refreshTokenModel.TokenExpires = DateTime.Now.AddDays(7);
                    refreshTokenModel.IsActive = true;

                    _dBContext.RefreshToken.Update(refreshTokenModel);
                    await _dBContext.SaveChangesAsync();
                }
            }
            else
            {
                refreshTokenModel = new RefreshTokenModel
                {
                    UserId = userId,
                    Token = refreshToken,
                    TokenExpires = DateTime.Now.AddDays(7),
                    IsActive = true,
                };

                await _dBContext.RefreshToken.AddAsync(refreshTokenModel);
                await _dBContext.SaveChangesAsync();
            }

            return refreshTokenModel.Token;
        }

        public async Task<RefreshTokenModel> GetRefreshToken(int userId)
        {
            var refreshTokenModel = await _dBContext.RefreshToken.FirstOrDefaultAsync(i => i.UserId == userId);
            if (refreshTokenModel == null)
            {
                return new RefreshTokenModel { IsActive = false };
            }


            var dateCompare = DateTime.Compare(refreshTokenModel.TokenExpires, DateTime.Now);
            if (dateCompare < 1)
            {
                refreshTokenModel.IsActive = false;
            }

            return refreshTokenModel;
        }
    }
}
