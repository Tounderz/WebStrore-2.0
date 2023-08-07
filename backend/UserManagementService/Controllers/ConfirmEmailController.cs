using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using UserManagementService.Constants;
using UserManagementService.Data.Abstract;

namespace UserManagementService.Controllers
{
    [Route(ConstRouteTitle.CONFIRM_EMAIL_ROUTE)]
    [ApiController]
    public class ConfirmEmailController : ControllerBase
    {
        private readonly IConfirmEmail _confirmEmail;

        public ConfirmEmailController(IConfirmEmail confirmEmail)
        {
            _confirmEmail = confirmEmail;
        }

        [HttpGet(ConstTitleMethods.CONFIRM_EMAIL)]
        public async Task<IActionResult> ConfirmEmail(string token)
        {
            var status = await _confirmEmail.ConfirmEmailService(token);
            if (status.StatusCode == 0)
            {
                return BadRequest(new { message = status.StatusMessage });
            }

            return Ok(new { message = status.StatusMessage });
        }

        [HttpPost(ConstTitleMethods.UPDATE)]
        public async Task<IActionResult> UpdateToken(string email)
        {
            var status = await _confirmEmail.UpdatingToken(email);
            if (status.StatusCode == 0)
            {
                return BadRequest(new { message = status.StatusMessage });
            }

            return Ok(new { message = status.StatusMessage });
        }
    }
}
