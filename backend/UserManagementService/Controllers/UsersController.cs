using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Linq;
using System;
using UserManagementService.Data.Abstract;
using UserManagementService.Models.DTO;
using System.IO;
using System.Threading.Tasks;
using UserManagementService.Models;
using UserManagementService.Constants;
using System.Globalization;

#pragma warning disable CS8601
#pragma warning disable IDE0037

namespace UserManagementService.Controllers
{
    [Route(ConstRouteTitle.USERS_ROUTE)]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly IUser _user;
        private readonly IConfirmEmail _confirmEmail;

        public UsersController(IUser user, IConfirmEmail confirmEmail)
        {
            _user = user;
            _confirmEmail = confirmEmail;
        }

        [HttpGet(ConstTitleMethods.USER)]
        public async Task<IActionResult> GetUser(string login)
        {
            var user = await _user.GetUserByLogin(login);
            if (user == null) 
            {
                return BadRequest(new { message = "User not found" });
            }

            return Ok(new { user = user });
        }

        [HttpGet(ConstTitleMethods.LIST)]
        public async Task<IActionResult> AllUsers(int page)
        {
            var users = await _user.GetAllUsers();
            if (users == null || !users.Any())
            {
                return BadRequest(new { message = "Unable to retrieve users" });
            }

            var (countPages, usersList) = _user.GetUserTable(users, page);
            return Ok(new
            {
                usersList = usersList,
                countPages = countPages
            });
        }

        [HttpPost(ConstTitleMethods.REGISTER)]
        public async Task<IActionResult> Register()
        {
            var model = GetUserRegisterModel();
            if (string.IsNullOrEmpty(model.Email) || string.IsNullOrEmpty(model.Login) || string.IsNullOrEmpty(model.Password))
            {
                return BadRequest(new { message = "Email, login, and password are required fields" });
            }

            var status = await _user.IsLoginAvailable(model.Login, 0);
            if (status.StatusCode == 0)
            {
                return BadRequest(new { message = status.StatusMessage });
            }

            status = await _user.IsEmailAvailable(model.Email, 0);
            if (status.StatusCode == 0)
            {
                return BadRequest(new { message = status.StatusMessage });
            }

            status = await _confirmEmail.CreateToken(model.Email);
            if (status.StatusCode == 0)
            {
                return BadRequest(new { message = status.StatusMessage });
            }

            status = await _user.SignUp(model);
            if (status.StatusCode == 0)
            {
                return BadRequest(new { message = status.StatusMessage });
            }

            return Ok( new { success = true, message = status.StatusMessage });
        }

        [HttpPost(ConstTitleMethods.EDIT)]
        public async Task<IActionResult> EditUser()
        {
            var model = GetUserRegisterModel();
            if (model == null)
            {
                return BadRequest(new { message = "Invalid user data" });
            }

            var status = !string.IsNullOrEmpty(model.Email) ? await _confirmEmail.CreateToken(model.Email) : new StatusModel { StatusCode = 1 };
            if (status.StatusCode == 0)
            {
                return BadRequest(new { message = status.StatusMessage });
            }

            status = await _user.Edit(model);
            if (status.StatusCode == 0)
            {
                return BadRequest(new { message = status.StatusMessage });
            }

            return Ok(new { success = true, message = status.StatusMessage });
        }

        [HttpPost(ConstTitleMethods.EDIT_PASSWORD)]
        public async Task<IActionResult> EditPassword(EditPasswordDto dto)
        {
            var status = await _user.EditPassword(dto);
            if (status.StatusCode == 0)
            {
                return BadRequest(new { message = status.StatusMessage });
            }

            return Ok( new { success = true, message = status.StatusMessage });
        }

        [HttpPost(ConstTitleMethods.EDIT_IMG)]
        public async Task<IActionResult> EditImg()
        {
            var userId = Request.Form.TryGetValue("Id", out var idValue) &&
                         int.TryParse(idValue, out var id) ? id : 0;
            var img = Request.Form.Files.Count != 0 ? Request.Form.Files[0] : null;
            if (userId < 1 || img == null)
            {
                return BadRequest(new { message = "Invalid user data" });
            }

            var status = await _user.EditImg(userId, img);
            if (status.StatusCode == 0)
            {
                return BadRequest(new { message = status.StatusMessage });
            }

            return Ok(new { success = true, message = status.StatusMessage });
        }

        [HttpDelete(ConstTitleMethods.DELETE)]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var status = await _user.Delete(id);
            if (status.StatusCode == 0)
            {
                return BadRequest(new { message = status.StatusMessage });
            }

            return Ok(new { success = true, message = status.StatusMessage });
        }

        [NonAction]
        private RegisterDto GetUserRegisterModel()
        {
            var model = new RegisterDto
            {
                UserId = Request.Form.TryGetValue("Id", out var idValue) && 
                         int.TryParse(idValue, out var id) ? id : 0,
                Name = Request.Form.TryGetValue("Name", out var name) ? name : string.Empty,
                LastName = Request.Form.TryGetValue("LastName", out var lastName) ? lastName : string.Empty,
                GenderId = Request.Form.TryGetValue("GenderId", out var genderIdValue) && 
                           int.TryParse(genderIdValue, out var genderId) ? genderId : 0,
                DateOfBirth = Request.Form.TryGetValue("DateOfBirth", out var dobValue) &&
                              DateTime.TryParseExact(dobValue, "yyyy-MM-dd", CultureInfo.InvariantCulture, DateTimeStyles.None, out var dob) ? 
                              dob : DateTime.MinValue,
                Email = Request.Form.TryGetValue("Email", out var email) ? email : string.Empty,
                Phone = Request.Form.TryGetValue("Phone", out var phone) ? phone : string.Empty,
                Login = Request.Form.TryGetValue("Login", out var login) ? login : string.Empty,
                Password = Request.Form.TryGetValue("Password", out var password) ? password : string.Empty,
                RoleId = Request.Form.TryGetValue("RoleId", out var roleIdValue) && 
                         int.TryParse(roleIdValue, out var roleId) ? roleId : 0,
                Img = Request.Form.Files.Count != 0 ? Request.Form.Files[0] : null
            };

            return model;
        }
    }
}