using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Store.Api.Data.Abstract;
using Store.Data.Constants;
using Store.Data.Models.Dtos;

#pragma warning disable CS8601

namespace Store.Api.Controllers
{
    [Route(ConstRouteTitle.BRANDS_ROUTE)]
    [ApiController]
    public class BrandController : ControllerBase
    {
        private readonly IBrand _brand;
        private readonly ICategoriesBrands _categoriesBrands;
        private readonly IGetProduct _getProduct;
        private readonly IType _type;

        public BrandController(IBrand brand, ICategoriesBrands categoriesBrands, IGetProduct getProduct, IType type)
        {
            _brand = brand;
            _categoriesBrands = categoriesBrands;
            _getProduct = getProduct;
            _type = type;
        }

        [HttpGet(ConstTitleMethods.LIST)]
        public async Task<IActionResult> GetBrands(int categoryId)
        {
            var brands = await _brand.GetBrands(categoryId);
            if (brands.Count < 1 || brands == null)
            {
                return BadRequest(new { message = "No brands found." });
            }

            return Ok(new { brands = brands });
        }

        [HttpGet(ConstTitleMethods.TABLE)]
        public async Task<IActionResult> GetTableBrands(int currentPage)
        {
            var (countPages, brands) = await _brand.GetTableBrands(currentPage);
            if (brands == null)
            {
                return BadRequest(new { message = "No brands found." });
            }

            return Ok(new { countPages = countPages, brands = brands });
        }

        [HttpGet(ConstTitleMethods.PRODUCTS_BY_BRAND)]
        public async Task<IActionResult> GetProductsBrand(int brandId, string role, int currentPage)
        {
            if (brandId == 0)
            {
                return BadRequest(new { message = "Invalid brand Id." });
            }

            role = string.IsNullOrEmpty(role) ? string.Empty : role.ToLower();
            if (role != ConstParameters.ADMIN_ROLE && role != ConstParameters.MODERATOR_ROLE)
            {
                var status = await _brand.CountView(brandId);
                if (status.StatusCode == 0)
                {
                    return BadRequest(new { message = status.StatusMessage });
                }
            }

            var (countPages, products) = await _getProduct.GetProductsByBrandId(currentPage, brandId, new List<int>());
            if (products == null)
            {
                return BadRequest(new { message = "There are no products according to the selected criteria!" });
            }

            var types = products.Select(i => i.TypeId).ToList();

            return Ok(new
            {
                products = products,
                countPages = countPages,
                types = types
            });
        }

        [HttpGet(ConstTitleMethods.BRAND_BY_CATEGORY)]
        public async Task<IActionResult> GetProductsCategoryByBrand(int brandId, string categoriesId, int currentPage)
        {
            var categoriesIdArray = !string.IsNullOrEmpty(categoriesId) ?
                categoriesId.Trim(' ').Split(',').Select(int.Parse).ToList() :
                new List<int>();
            var (countPages, products) = await _getProduct.GetProductsByBrandId(currentPage, brandId, categoriesIdArray);
            if (products == null)
            {
                return BadRequest(new { message = "There are no products according to the selected criteria!" });
            }

            var typesId = products.Select(i => i.TypeId).ToList();
            var types = await _type.GetTypesByBrand(typesId);

            return Ok(new
            {
                products = products,
                countPages = countPages,
                types = types
            });
        }

        [HttpPost(ConstTitleMethods.CREATE)]
        public async Task<IActionResult> CreateBrand()
        {
            var brandDto = GetBrandDto();
            if (brandDto == null || string.IsNullOrEmpty(brandDto.Name))
            {
                return BadRequest(new { message = "Invalid brand data." });
            }

            if (brandDto.CategoriesId.Length < 1)
            {
                return BadRequest(new { message = "It is required to select the category(s) for this brand!" });
            }

            var status = await  _brand.CreateBrand(brandDto);
            if (status.StatusCode == 0)
            {
                return BadRequest(new { message = status.StatusMessage });
            }

            var brand = await _brand.GetBrandByName(brandDto.Name);
            if (brand == null)
            {
                return BadRequest(new { message = "Failed to retrieve the created brand." });
            }

            brandDto.Id = brand.Id;
            status = await _categoriesBrands.CreateCategoriesByBrand(brandDto);
            if (status.StatusCode == 0)
            {
                return BadRequest(new { message = status.StatusMessage });
            }

            return Ok(new { success = true, message = status.StatusMessage });
        }

        [HttpPost(ConstTitleMethods.EDIT)]
        public async Task<IActionResult> EditBrand()
        {
            var brandDto = GetBrandDto();
            if (brandDto == null)
            {
                return BadRequest(new { message = "Invalid brand data." });
            }

            var status = await _brand.EditBrand(brandDto);
            if (status.StatusCode == 0)
            {
                return BadRequest(new { message = status.StatusMessage });
            }

            return Ok(new { success = true, message = status.StatusMessage });
        }

        [HttpDelete(ConstTitleMethods.DELETE)]
        public async Task<IActionResult> DeleteBrand(int id)
        {
            var status = await _brand.DeleteBrand(id);
            if (status.StatusCode == 0)
            {
                return BadRequest(new { message = status.StatusMessage });
            }

            return Ok(new { success = true, message = status.StatusMessage });
        }

        [NonAction]
        private BrandDto GetBrandDto()
        {
            var brandDto = new BrandDto
            {
                Id = Request.Form.TryGetValue(ConstPropertyName.ID, out var idValue) &&
                     int.TryParse(idValue, out var id) ? id : 0,
                Name = Request.Form.TryGetValue(ConstPropertyName.NAME, out var name) ? name : string.Empty,
                Info = Request.Form.TryGetValue(ConstPropertyName.INFO, out var info) ? info : string.Empty,
                CategoriesId = Request.Form.TryGetValue(ConstPropertyName.CATEGORIES_ID, out var categoriesIdValue) &&
                               !string.IsNullOrEmpty(categoriesIdValue) ?
                               categoriesIdValue.ToString().Trim(' ').Split(',').Select(int.Parse).ToArray() : Array.Empty<int>(),
                CountView = Request.Form.TryGetValue(ConstPropertyName.COUNT_VIEW, out var countViewValue) &&
                     int.TryParse(countViewValue, out var countView) ? countView : 0,
                Img = Request.Form.Files.Count != 0 ? Request.Form.Files[0] : null
            };

            return brandDto;
        }
    }
}
