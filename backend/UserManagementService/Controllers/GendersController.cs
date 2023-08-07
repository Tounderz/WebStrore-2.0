using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using UserManagementService.Constants;
using UserManagementService.Data.Abstract;
using UserManagementService.Models.DTO;
using UserManagementService.Models;

namespace UserManagementService.Controllers
{
    [Route(ConstRouteTitle.GENDERS_ROUTE)]
    [ApiController]
    public class GendersController : ControllerBase
    {
        private readonly IGender _gender;

        public GendersController(IGender gender)
        {
            _gender = gender;
        }

        [HttpGet(ConstTitleMethods.GENDER)]
        public async Task<IActionResult> GetGender(int id)
        {
            var gender = await _gender.GetGenderById(id);
            if (gender == null)
            {
                return BadRequest(new { message = "Gender not found." });
            }

            return Ok(new { gender = gender });
        }

        [HttpGet(ConstTitleMethods.LIST)]
        public async Task<IActionResult> GetGenders(int currentPage)
        {
            var genders = new List<GenderModel>();
            var countPages = 0;
            if (currentPage < 1)
            {
                genders = await _gender.GetAllGenders();
            }
            else
            {
                (countPages, genders) = await _gender.GetTableGenders(currentPage);
            }

            if (genders == null)
            {
                return BadRequest(new { message = "No genders found." });
            }

            return Ok(new { genders = genders, countPages = countPages });
        }

        [HttpPost(ConstTitleMethods.CREATE)]
        public async Task<IActionResult> CreateGender(GenderModel model)
        {
            var status = await _gender.IsGenderNameAvailable(model.GenderName);
            if (status.StatusCode == 0)
            {
                return BadRequest(new { message = status.StatusMessage });
            }

            status = await _gender.Create(model);
            if (status.StatusCode == 0)
            {
                return BadRequest(new { message = status.StatusMessage });
            }

            return Ok(new { success = true, message = status.StatusMessage });
        }

        [HttpPost(ConstTitleMethods.EDIT)]
        public async Task<IActionResult> EditGender(GenderModel model)
        {
            var status = await _gender.IsGenderNameAvailable(model.GenderName);
            if (status.StatusCode == 0)
            {
                return BadRequest(new { message = status.StatusMessage });
            }

            status = await _gender.Edit(model);
            if (status.StatusCode == 0)
            {
                return BadRequest(new { message = status.StatusMessage });
            }

            return Ok(new { success = true, message = status.StatusMessage });
        }

        [HttpDelete(ConstTitleMethods.DELETE)]
        public async Task<IActionResult> DeleteGender(int id)
        {
            var status = await _gender.Delete(id);
            if (status.StatusCode == 0)
            {
                return BadRequest(new { message = status.StatusMessage });
            }

            return Ok(new { success = true, message = status.StatusMessage });
        }

        [HttpPost(ConstTitleMethods.REPLACE)]
        public async Task<IActionResult> ReplaceGender(ReplaceGenderDto dto)
        {
            var status = await _gender.ReplaceGenderWithUsers(dto);
            if (status.StatusCode == 0)
            {
                return BadRequest(new { message = status.StatusMessage });
            }

            return Ok(new { success = true, message = status.StatusMessage });
        }
    }
}
