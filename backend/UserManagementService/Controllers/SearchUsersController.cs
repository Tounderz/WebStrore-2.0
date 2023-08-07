using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using UserManagementService.Constants;
using UserManagementService.Data.Abstract;
using UserManagementService.Models.DTO;

namespace UserManagementService.Controllers
{
    [Route(ConstRouteTitle.SEARCH_ROUTE)]
    [ApiController]
    public class SearchUsersController : ControllerBase
    {
        private readonly ISearch _searchUser;
        private readonly IUser _user;

        public SearchUsersController(ISearch searchUser, IUser user)
        {
            _searchUser = searchUser;
            _user = user;
        }

        [HttpGet(ConstTitleMethods.LIST)]
        public async Task<IActionResult> SearchUsers(string parameter, int currentPage, string criterie)
        {
            var search = await _searchUser.ResaultSearchUsers(parameter, criterie);
            if (search == null || !search.Any())
            {
                return BadRequest(new { message = "No users found" });
            }

            var (countPages, users) = _user.GetUserTable(search, currentPage);
            return Ok(new
            {
                usersList = users,
                countPages = countPages
            });
        }

        [HttpGet(ConstTitleMethods.SEARCH_ROLE)]
        public async Task<IActionResult> SearchRoles(string parameter, int currentPage, string criterie)
        {
            var (countPages, roles) = await _searchUser.SearchRoles(parameter, criterie, currentPage);
            if (roles == null)
            {
                return BadRequest(new { message = "No roles found" });
            }

            return Ok(new
            {
                roles = roles,
                countPages = countPages
            });
        }

        [HttpGet(ConstTitleMethods.SEARCH_GENDER)]
        public async Task<IActionResult> SearchGender(string parameter, int currentPage, string criterie)
        {
            var (countPages, genders) = await _searchUser.SearchGenders(parameter, criterie, currentPage);
            if (genders == null)
            {
                return BadRequest(new { message = "No genders found" });
            }

            return Ok(new
            {
                genders = genders,
                countPages = countPages
            });
        }
    }
}
