using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using Store.Api.Data.Abstract;
using Store.Data.Constants;
using Store.Data.Models.Dtos;

#pragma warning disable CS8601

namespace Store.Api.Controllers
{
    [Route(ConstRouteTitle.CATEGORIES_ROUTE)]
    [ApiController]
    public class CategoryController : ControllerBase
    {
        private readonly ICategory _category;
        private readonly ICategoriesBrands _categoriesBrands;
        private readonly IGetProduct _getProduct;
        private readonly IType _type;

        public CategoryController(ICategory category, ICategoriesBrands categoriesBrands, IGetProduct getProduct, IType type)
        {
            _category = category;
            _categoriesBrands = categoriesBrands;
            _getProduct = getProduct;
            _type = type;
        }

        [HttpGet(ConstTitleMethods.LIST)]
        public async Task<IActionResult> GetCategories(int brandId)
        {
            var categories = await _category.GetCategories(brandId);
            if (categories.Count < 1 || categories == null)
            {
                return BadRequest(new { message = "No categories found." });
            }

            return Ok(new { categories });
        }

        [HttpGet(ConstTitleMethods.TABLE)]
        public async Task<IActionResult> GetTableCategories(int currentPage)
        {
            var (countPages, categories) = await _category.GetTableCategories(currentPage);
            if (categories == null)
            {
                return BadRequest(new { message = "No categories found." });
            }

            return Ok(new { countPages, categories });
        }

        [HttpGet(ConstTitleMethods.PRODUCTS_BY_CATEGORY)]
        public async Task<IActionResult> GetProductsCategory(int categoryId, string role, int currentPage)
        {
            if (categoryId == 0)
            {
                return BadRequest(new { message = "Invalid category Id." });
            }

            role = string.IsNullOrEmpty(role) ? string.Empty : role.ToLower();
            if (role != ConstParameters.ADMIN_ROLE && role != ConstParameters.MODERATOR_ROLE)
            {
                var status = await _category.CountView(categoryId);
                if (status.StatusCode == 0)
                {
                    return BadRequest(new { message = status.StatusMessage });
                }
            }

            var (countPages, products) = await _getProduct.GetProductsByCategoryId(currentPage, categoryId, new List<int>());
            if (products == null)
            {
                return BadRequest(new { message = "There are no products according to the selected criteria!" });
            }

            return Ok(new
            {
                products,
                countPages
            });
        }

        [HttpGet(ConstTitleMethods.CATEGORY_BY_BRAND)]
        public async Task<IActionResult> GetProductsCategoryByBrand(int categoryId, string brandsId, int currentPage)
        {
            var brandsIdArray = !string.IsNullOrEmpty(brandsId) ?
                brandsId.Trim(' ').Split(',').Select(int.Parse).ToList() :
                new List<int>();
            var (countPages, products) = await _getProduct.GetProductsByCategoryId(currentPage, categoryId, brandsIdArray);
            if (products == null)
            {
                return BadRequest(new { message = "There are no products according to the selected criteria!" });
            }

            var typesId = products.Select(i => i.TypeId).ToList();
            var types = await _type.GetTypesByBrand(typesId);

            return Ok(new
            {
                products,
                countPages,
                types
            });
        }

        [HttpPost(ConstTitleMethods.CREATE)]
        public async Task<IActionResult> CreateCategory()
        {
            var categoryDto = FormCategoryDto();
            if (categoryDto == null || string.IsNullOrEmpty(categoryDto.Name))
            {
                return BadRequest(new { message = "Invalid category data." });
            }

            if (categoryDto.BrandsId.Length < 1)
            {
                return BadRequest(new { message = "It is required to select the brand(s) for this category!" });
            }

            var status = await _category.CreateCategory(categoryDto);
            if (status.StatusCode == 0)
            {
                return BadRequest(new { message = status.StatusMessage });
            }

            var category = await _category.GetCategoryByName(categoryDto.Name);
            if (category == null)
            {
                return BadRequest(new { message = "Failed to retrieve the created category." });
            }

            categoryDto.Id = category.Id;

            status = await _categoriesBrands.CreateBrandsByCategory(categoryDto);
            if (status.StatusCode == 0)
            {
                return BadRequest(new { message = status.StatusMessage });
            }

            return Ok(new { success = true, message = status.StatusMessage });
        }

        [HttpPost(ConstTitleMethods.EDIT)]
        public async Task<IActionResult> EditCategory()
        {
            var categoryDto = FormCategoryDto();
            if (categoryDto == null)
            {
                return BadRequest(new { message = "Invalid category data." });
            }

            var status = await _category.EditCategory(categoryDto);
            if (status.StatusCode == 0)
            {
                return BadRequest(new { message = status.StatusMessage });
            }

            status = await _categoriesBrands.EditBrandsByCategory(categoryDto);
            if (status.StatusCode == 0)
            {
                return BadRequest(new { message = status.StatusMessage });
            }

            return Ok(new { success = true, message = status.StatusMessage });
        }

        [HttpDelete(ConstTitleMethods.DELETE)]
        public async Task<IActionResult> DeleteCategory(int id)
        {
            var status = await _category.DeleteCategory(id);
            if (status.StatusCode == 0)
            {
                return BadRequest(new { message = status.StatusMessage });
            }

            return Ok(new { success = true, message = status.StatusMessage });
        }

        [NonAction]
        private CategoryDto FormCategoryDto()
        {
            var categoryDto = new CategoryDto
            {
                Id = Request.Form.TryGetValue(ConstPropertyName.ID, out var idValue) &&
                     int.TryParse(idValue, out var id) ? id : 0,
                Name = Request.Form.TryGetValue(ConstPropertyName.NAME, out var name) ? name : string.Empty,
                Info = Request.Form.TryGetValue(ConstPropertyName.INFO, out var info) ? info : string.Empty,
                ShortDescription = Request.Form.TryGetValue(ConstPropertyName.SHORT_DESCRIPTION, out var shortDescription) ? shortDescription : string.Empty,
                BrandsId = Request.Form.TryGetValue(ConstPropertyName.BRANDS_ID, out var brandsIdValue) &&
                               !string.IsNullOrEmpty(brandsIdValue) ?
                               brandsIdValue.ToString().Trim(' ').Split(',').Select(int.Parse).ToArray() : Array.Empty<int>(),
                CountView = Request.Form.TryGetValue(ConstPropertyName.COUNT_VIEW, out var countViewValue) &&
                     int.TryParse(countViewValue, out var countView) ? countView : 0,
                Img = Request.Form.Files.Count != 0 ? Request.Form.Files[0] : null

            };

            return categoryDto;
        }
    }
}
