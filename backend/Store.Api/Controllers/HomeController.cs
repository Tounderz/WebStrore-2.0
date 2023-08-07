using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Store.Api.Data.Abstract;
using Store.Data.Constants;

namespace Store.Api.Controllers
{
    [Route(ConstRouteTitle.HOME_ROUTE)]
    [ApiController]
    public class HomeController : ControllerBase
    {
        private readonly IGetProduct _getProduct;
        private readonly IBrand _brand;
        private readonly ICategory _category;

        public HomeController(IGetProduct getProduct, IBrand brand, ICategory category)
        {
            _getProduct = getProduct;
            _brand = brand;
            _category = category;
        }

        [HttpGet(ConstTitleMethods.PRODUCTS_POPULAR)]
        public async Task<IActionResult> GetPopularProducts()
        {
            var popularProducts = await _getProduct.GetProductsPopular(ConstHome.LIMIT_PRODUCT_POPULAR);
            if (popularProducts == null)
            {
                return BadRequest(new { message = "Failed to retrieve products." });
            }

            return Ok(new { popularProducts });
        }

        [HttpGet(ConstTitleMethods.BRANDS_POPULAR)]
        public async Task<IActionResult> GetPopularBrands()
        {
            var popularBrands = await _brand.GetBrandsPopular(ConstHome.LIMIT_BRANDS_POPULAR);
            if (popularBrands == null)
            {
                return BadRequest(new { message = "Failed to retrieve brands." });
            }

            return Ok(new { popularBrands });
        }

        [HttpGet(ConstTitleMethods.CATEGORIES_POPULAR)]
        public async Task<IActionResult> GetPopularCategories()
        {
            var popularCategories = await _category.GetCategoriesPopular(ConstHome.LIMIT_CATEGORIES_POPULAR);
            if (popularCategories == null)
            {
                return BadRequest(new { message = "Failed to retrieve categories." });
            }

            return Ok(new { popularCategories });
        }
    }
}
