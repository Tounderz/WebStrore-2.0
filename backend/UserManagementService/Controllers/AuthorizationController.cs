using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.IdentityModel.Tokens;
using UserManagementService.Models;
using UserManagementService.Data.Abstract;
using UserManagementService.Models.DTO;
using UserManagementService.Constants;

#pragma warning disable CS8602
#pragma warning disable CS8604

namespace UserManagementService.Controllers
{
    [Route(ConstRouteTitle.AUTH_ROUTE)]
    [ApiController]
    public class AuthorizationController : ControllerBase
    {
        private readonly IAuth _auth;
        private readonly IRole _role;
        private readonly IJwt _jwtService;

        public AuthorizationController(IAuth auth, IJwt jwtService, IRole role)
        {
            _auth = auth;
            _jwtService = jwtService;
            _role = role;
        }

        [HttpPost(ConstTitleMethods.LOGIN)]
        public async Task<IActionResult> Login(LoginDto dto)
        {
            var (status, user) = await _auth.SignIn(dto);
            if (status.StatusCode == 0 && user == null)
            {
                return BadRequest(new { message = status.StatusMessage });
            }

            if (status.StatusCode == 0 && user != null)
            {
                return Ok( new { isDeleted = user.IsDeleted, isConfirmEmail = user.IsConfirmEmail });
            }

            var role = await _role.GetRoleById(user.RoleId);
            if (role == null)
            {
                return BadRequest(new { message = "Role not found" });
            }

            var accessToken = _jwtService.GenerateJwt(user.Login, user.Email, role.RoleName);
            var refreshToken = await _jwtService.GenerateRefreshToken(user.Id);
            var userDto = _auth.CreateUserResponseModel(user, role.RoleName);

            return Ok(new
            {
                isDeleted = user.IsDeleted,
                isConfirmEmail = user.IsConfirmEmail,
                user = userDto,
                accessToken = accessToken
            });
        }

        [HttpGet(ConstTitleMethods.REFRESH_TOKEN)]
        public async Task<IActionResult> RefreshToken()
        {
            var jwtToken = "";

            foreach (var header in Request.Headers)
            {
                if (header.Key == ConstParameter.AUTHORIZATION)
                {
                    jwtToken = header.Value;
                    break;
                }
            }

            var token = _jwtService.Verify(jwtToken[7..]);
            if (token != null && !token.Header.Alg.Equals(SecurityAlgorithms.HmacSha256))
            {
                return Unauthorized();
            }

            var user = await _auth.GetByUserFromToken(token);
            var refreshTokenModel = await _jwtService.GetRefreshToken(user.Id);
            if (!refreshTokenModel.IsActive)
            {
                return BadRequest( new { isActive = refreshTokenModel.IsActive } );
            }

            var role = await _role.GetRoleById(user.RoleId);
            if (role == null)
            {
                return BadRequest(new { message = "Role not found" });
            }

            var accessToken = _jwtService.GenerateJwt(user.Login, user.Email, role.RoleName);
            var refreshToken = await _jwtService.GenerateRefreshToken(user.Id);
            var userDto = _auth.CreateUserResponseModel(user, role.RoleName);

            return Ok(new
            {
                accessToken = accessToken,
                user = userDto
            });
        }

        [HttpPost(ConstTitleMethods.LOGOUT)]
        public IActionResult Logout()
        {
            return Ok(new { user = new UserResponseDto { IsAuth = false } });
        }       
    }
}
