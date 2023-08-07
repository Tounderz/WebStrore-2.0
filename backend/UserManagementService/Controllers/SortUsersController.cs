using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using UserManagementService.Constants;
using UserManagementService.Data.Abstract;
using UserManagementService.Models.DTO;

namespace UserManagementService.Controllers
{
    [Route(ConstRouteTitle.SORT_ROUTE)]
    [ApiController]
    public class SortUsersController : ControllerBase
    {
        private readonly ISort _sortUser;
        private readonly IUser _user;

        public SortUsersController(ISort sortUser, IUser user)
        {
            _sortUser = sortUser;
            _user = user;
        }

        [HttpGet(ConstTitleMethods.LIST)]
        public async Task<IActionResult> SortUsers(string propertyTitle, string typeSort, int currentPage)
        {
            if (string.IsNullOrEmpty(propertyTitle) || string.IsNullOrEmpty(typeSort))
            {
                return BadRequest(new { message = "" });
            }

            var sort = await _sortUser.SortUsers(propertyTitle, typeSort);
            if (sort == null)
            {
                return BadRequest(new { message = "No users found" });
            }

            var (countPages, users) = _user.GetUserTable(sort, currentPage);
            return Ok(new
            {
                usersList = users,
                countPages = countPages
            });
        }

        [HttpGet(ConstTitleMethods.SORT_ROLES)]
        public async Task<IActionResult> SortRoles(string propertyTitle, string typeSort, int currentPage)
        {
            if (string.IsNullOrEmpty(propertyTitle) || string.IsNullOrEmpty(typeSort))
            {
                return BadRequest(new { message = "" });
            }

            var (countPages, roles) = await _sortUser.SortRoles(propertyTitle, typeSort, currentPage);
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

        [HttpGet(ConstTitleMethods.SORT_GENDERS)]
        public async Task<IActionResult> SortGenders(string propertyTitle, string typeSort, int currentPage)
        {
            if (string.IsNullOrEmpty(propertyTitle) || string.IsNullOrEmpty(typeSort))
            {
                return BadRequest(new { message = "" });
            }

            var (countPages, genders) = await _sortUser.SortGenders(propertyTitle, typeSort, currentPage);
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
