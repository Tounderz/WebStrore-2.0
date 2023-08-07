using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using UserManagementService.Constants;
using UserManagementService.Data.Abstract;

namespace UserManagementService.Controllers
{
    [Route(ConstRouteTitle.RECOVERY_ROUTE)]
    [ApiController]
    public class AccountRecoveryController : ControllerBase
    {
        private readonly IAccountRecovery _accountRecovery;
        private readonly ISendEmail _sendEmail;
        private readonly IUser _user;

        public AccountRecoveryController(IAccountRecovery accountRecovery, ISendEmail sendEmail, IUser user)
        {
            _accountRecovery = accountRecovery;
            _sendEmail = sendEmail;
            _user = user;
        }

        [HttpPost(ConstTitleMethods.CREATE)]
        public async Task<IActionResult> CreateToken(string email)
        {
            var user = await _user.GetUserByEmail(email);
            if (user == null)
            {
                return BadRequest();
            }

            var status = await _accountRecovery.CreateToken(email);
            if (status.StatusCode == 0)
            {
                return BadRequest(new { message = status.StatusMessage });
            }

            return Ok(new { message = status.StatusMessage });
        }

        [HttpPost(ConstTitleMethods.UPDATE)]
        public async Task<IActionResult> UpdateToken(string email)
        {
            var user = await _user.GetUserByEmail(email);
            if (user == null)
            {
                return BadRequest();
            }
            var status = await _accountRecovery.UpdateToken(email);
            if (status.StatusCode == 0)
            {
                return BadRequest(new { message = status.StatusMessage });
            }

            return Ok(new { message = status.StatusMessage });
        }

        [HttpGet(ConstTitleMethods.RESTORED)]
        public async Task<IActionResult> RestoredAccount(string token)
        {
            var status = await _accountRecovery.GetUserByToken(token);
            if (status.StatusCode == 0)
            {
                return BadRequest(new {message = status.StatusMessage });
            }

            status = await _accountRecovery.AccountRecovery(token);
            if (status.StatusCode == 0)
            {
                return BadRequest(new { message = status.StatusMessage });
            }

            return Ok(new { message = status.StatusMessage });
        }
    }
}
