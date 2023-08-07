using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using UserManagementService.Constants;
using UserManagementService.Data.Abstract;
using UserManagementService.Models;
using UserManagementService.Models.DTO;

namespace UserManagementService.Controllers
{
    [Route(ConstRouteTitle.ROLES_ROUTE)]
    [ApiController]
    public class RolesController : ControllerBase
    {
        private readonly IRole _role;

        public RolesController(IRole role)
        {
            _role = role;
        }

        [HttpGet(ConstTitleMethods.ROLE)]
        public async Task<IActionResult> GetRole(int id)
        {
            var role = await _role.GetRoleById(id);
            if (role == null)
            {
                return BadRequest(new { message = "Role not found." });
            }

            return Ok( new { role = role });
        }

        [HttpGet(ConstTitleMethods.LIST)]
        public async Task<IActionResult> GetRoles(int currentPage)
        {
            var roles = new List<RoleModel>();
            var countPages = 0;
            if (currentPage < 1)
            {
                roles = await _role.GetAllRoles();
            }
            else
            {
                (countPages, roles) = await _role.GetTableRoles(currentPage);
            }
            
            if (roles == null)
            {
                return BadRequest(new { message = "No roles found." });
            }

            return Ok(new { roles = roles, countPages = countPages });
        }

        [HttpPost(ConstTitleMethods.CREATE)]
        public async Task<IActionResult> CreateRole(RoleModel model)
        {
            var status = await _role.IsRoleNameAvailable(model.RoleName);
            if (status.StatusCode == 0)
            {
                return BadRequest(new { message = status.StatusMessage });
            }

            status = await _role.Create(model);
            if (status.StatusCode == 0)
            {
                return BadRequest(new { message = status.StatusMessage });
            }

            return Ok(new { success = true, message = status.StatusMessage });
        }

        [HttpPost(ConstTitleMethods.EDIT)]
        public async Task<IActionResult> EditRole(RoleModel model)
        {
            var status = await _role.IsRoleNameAvailable(model.RoleName);
            if (status.StatusCode == 0)
            {
                return BadRequest(new { message = status.StatusMessage });
            }

            status = await _role.Edit(model);
            if (status.StatusCode == 0)
            {
                return BadRequest(new { message = status.StatusMessage });
            }

            return Ok(new { success = true, message = status.StatusMessage });
        }

        [HttpDelete(ConstTitleMethods.DELETE)]
        public async Task<IActionResult> DeleteRole(int id)
        {
            var status = await _role.Delete(id);
            if (status.StatusCode == 0)
            {
                return BadRequest(new { message = status.StatusMessage });
            }

            return Ok(new { success = true, message = status.StatusMessage });
        }

        [HttpPost(ConstTitleMethods.REPLACE)]
        public async Task<IActionResult> ReplaceRole(ReplaceRoleDto dto)
        {
            var status = await _role.ReplaceRoleWithUsers(dto);
            if (status.StatusCode == 0)
            {
                return BadRequest(new { message = status.StatusMessage });
            }

            return Ok(new { success = true, message = status.StatusMessage });
        }
    }
}
