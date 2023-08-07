using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Store.Api.Data.Abstract;
using Store.Data.Constants;
using System.Threading.Tasks;

namespace Store.Api.Controllers
{
    [Route(ConstRouteTitle.SORT_ROUTE)]
    [ApiController]
    public class SortController : ControllerBase
    {
        private readonly ISort _sort;

        public SortController(ISort sort)
        {
            _sort = sort;
        }

        [HttpGet(ConstTitleMethods.SORT_PRODUCTS)]
        public async Task<IActionResult> SortProducts(string propertyTitle, string typeSort, int currentPage)
        {
            if (string.IsNullOrEmpty(propertyTitle) || string.IsNullOrEmpty(typeSort))
            {
                return BadRequest(new { message = "" });
            }

            var (countPages, products) = await _sort.SortProduct(propertyTitle, typeSort, currentPage);
            if (products == null)
            {
                return BadRequest(new { message = "Failed to sort products." });
            }

            return Ok( new
            {
                products = products,
                countPages = countPages
            });
        }

        [HttpGet(ConstTitleMethods.SORT_BRANDS)]
        public async Task<IActionResult> SortBrands(string propertyTitle, string typeSort, int currentPage)
        {
            if (string.IsNullOrEmpty(propertyTitle) || string.IsNullOrEmpty(typeSort))
            {
                return BadRequest(new { message = "" });
            }

            var (countPages, brands) = await _sort.SortBrand(propertyTitle, typeSort, currentPage);
            if (brands == null)
            {
                return BadRequest(new { message = "Failed to sort brands." });
            }

            return Ok(new
            {
                brands = brands,
                countPages = countPages
            });
        }

        [HttpGet(ConstTitleMethods.SORT_CATEGORIES)]
        public async Task<IActionResult> SortCategories(string propertyTitle, string typeSort, int currentPage)
        {
            if (string.IsNullOrEmpty(propertyTitle) || string.IsNullOrEmpty(typeSort))
            {
                return BadRequest(new { message = "" });
            }

            var (countPages, categories) = await _sort.SortCategory(propertyTitle, typeSort, currentPage);
            if (categories == null)
            {
                return BadRequest(new { message = "Failed to sort categories." });
            }

            return Ok(new
            {
                categories = categories,
                countPages = countPages
            });
        }

        [HttpGet(ConstTitleMethods.SORT_TYPES)]
        public async Task<IActionResult> SortTypes(string propertyTitle, string typeSort, int currentPage)
        {
            if (string.IsNullOrEmpty(propertyTitle) || string.IsNullOrEmpty(typeSort))
            {
                return BadRequest(new { message = "" });
            }

            var (countPages, types) = await _sort.SortType(propertyTitle, typeSort, currentPage);
            if (types == null)
            {
                return BadRequest(new { message = "Failed to sort types." });
            }

            return Ok(new
            {
                types = types,
                countPages = countPages
            });
        }

        [HttpGet(ConstTitleMethods.SORT_PAYMENT_METHODS)]
        public async Task<IActionResult> SortPAymentMethods(string propertyTitle, string typeSort, int currentPage)
        {
            if (string.IsNullOrEmpty(propertyTitle) || string.IsNullOrEmpty(typeSort))
            {
                return BadRequest(new { message = "" });
            }

            var (countPages, paymentMethods) = await _sort.SortPaymentMethod(propertyTitle, typeSort, currentPage);
            if (paymentMethods == null)
            {
                return BadRequest(new { message = "Failed to sort payment methods." });
            }

            return Ok(new
            {
                paymentMethods = paymentMethods,
                countPages = countPages
            });
        }
    }
}
