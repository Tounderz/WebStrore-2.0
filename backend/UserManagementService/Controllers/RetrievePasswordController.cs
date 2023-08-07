using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;
using UserManagementService.Data.Abstract;
using UserManagementService.Models;
using UserManagementService.Constants;
using UserManagementService.Models.DTO;

namespace UserManagementService.Controllers
{
    [Route(ConstRouteTitle.RETRIEVE_ROUTE)]
    [ApiController]
    public class RetrievePasswordController : ControllerBase
    {
        private readonly IPasswordRecovery _passwordRecovery;
        private readonly IUser _user;

        public RetrievePasswordController(IPasswordRecovery passwordRecovery, IUser user)
        {
            _passwordRecovery = passwordRecovery;
            _user = user;
        }

        [HttpGet(ConstTitleMethods.RETRIEVE_PASSWORD)]
        public async Task<IActionResult> RetrievePassword(string email)
        {
            var user = await _user.GetUserByEmail(email);
            if (user == null)
            {
                return BadRequest(new { message = "User with the specified email does not exist" });
            }

            var status = await _passwordRecovery.CreateToken(email);
            if (status.StatusCode == 0)
            {
                return BadRequest(new { message = status.StatusMessage });
            }

            return Ok( new { message = status.StatusMessage });
        }

        [HttpPost(ConstTitleMethods.EDIT_PASSWORD)]
        public async Task<IActionResult> EditPassword(string token, string newPassword)
        {
            var (status, email)= await _passwordRecovery.PasswordRecovery(token);
            if (status.StatusCode == 0)
            {
                return BadRequest(new { message = status.StatusMessage });
            }

            var user = await _user.GetUserByEmail(email);
            var dto = new EditPasswordDto()
            {
                UserId = user.Id,
                CurrentPassword = user.Password,
                NewPassword = newPassword
            };
            status = await _user.EditPassword(dto);
            if (status.StatusCode == 0)
            {
                return BadRequest(new { message = status.StatusMessage });
            }

            status = await _passwordRecovery.TokenRemovalFromDB(token);
            if (status.StatusCode == 0)
            {
                return BadRequest(new { message = status.StatusMessage });
            }

            return Ok(new { message = status.StatusMessage });
        }
    }
}
