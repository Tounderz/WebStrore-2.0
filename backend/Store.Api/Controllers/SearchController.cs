using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Store.Api.Data.Abstract;
using Store.Data.Constants;

namespace Store.Api.Controllers
{
    [Route(ConstRouteTitle.SEARCH_ROUTE)]
    [ApiController]
    public class SearchController : ControllerBase
    {
        private readonly ISearch _search;

        public SearchController(ISearch search)
        {
            _search = search;
        }

        [HttpGet(ConstTitleMethods.SEARCH_RESULT)]
        public async Task<IActionResult> Search(string parameter, int currentPage)
        {
            if (string.IsNullOrWhiteSpace(parameter))
            {
                return BadRequest(new { message = "" });
            }

            var (countPages, products) = await _search.ResaultSearch(parameter, currentPage);
            if (products == null)
            {
                return BadRequest(new { message = "According to the search criteria, nothing was found." });
            }

            return Ok(new { products = products, countPages = countPages });
        }

        [HttpGet(ConstTitleMethods.SEARCH_RESULT_PRODUCT)]
        public async Task<IActionResult> SearchProductAdmin(string parameter, int currentPage, string criteria)
        {
            if (string.IsNullOrWhiteSpace(parameter) || string.IsNullOrWhiteSpace(criteria))
            {
                return BadRequest(new { message = "" });
            }

            var (countPages, products) = await _search.ResaultSearchProducts(parameter, currentPage, criteria);
            if (products == null)
            {
                return BadRequest(new { message = "According to the search criteria, nothing was found." });
            }
                
            return Ok(new { products = products, countPages = countPages });
        }

        [HttpGet(ConstTitleMethods.SEARCH_RESULT_BRAND)]
        public async Task<IActionResult> SearchBrand(string parameter, int currentPage, string criteria)
        {
            if (string.IsNullOrWhiteSpace(parameter) || string.IsNullOrWhiteSpace(criteria))
            {
                return BadRequest(new { message = "" });
            }

            var (countPages, brands) = await _search.ResaultSearchBrands(parameter, currentPage, criteria);
            if (brands == null)
            {
                return BadRequest(new { message = "According to the search criteria, nothing was found." });
            }

            return Ok(new { brands = brands, countPages = countPages });
        }

        [HttpGet(ConstTitleMethods.SEARCH_RESULT_CATEGORY)]
        public async Task<IActionResult> SearchCategory(string parameter, int currentPage, string criteria)
        {
            if (string.IsNullOrWhiteSpace(parameter) || string.IsNullOrWhiteSpace(criteria))
            {
                return BadRequest(new { message = "" });
            }

            var (countPages, categories) = await _search.ResaultSearchCategories(parameter, currentPage, criteria);
            if (categories == null)
            {
                return BadRequest(new { message = "According to the search criteria, nothing was found." });
            }

            return Ok(new { categories = categories, countPages = countPages });
        }

        [HttpGet(ConstTitleMethods.SEARCH_RESULT_TYPE)]
        public async Task<IActionResult> SearchType(string parameter, int currentPage, string criteria)
        {
            if (string.IsNullOrWhiteSpace(parameter) || string.IsNullOrWhiteSpace(criteria))
            {
                return BadRequest(new { message = "" });
            }

            var (countPages, types) = await _search.ResaultSearchTypes(parameter, currentPage, criteria);
            if (types == null)
            {
                return BadRequest(new { message = "According to the search criteria, nothing was found." });
            }

            return Ok(new { types = types, countPages = countPages });
        }

        [HttpGet(ConstTitleMethods.SEARCH_RESULT_PAYMENT_METHOD)]
        public async Task<IActionResult> SearchPaymentMethod(string parameter, int currentPage, string criteria)
        {
            if (string.IsNullOrWhiteSpace(parameter) || string.IsNullOrWhiteSpace(criteria))
            {
                return BadRequest(new { message = "" });
            }

            var (countPages, paymentMethods) = await _search.ResaultSearchPaymentMethod(parameter, currentPage, criteria);
            if (paymentMethods == null)
            {
                return BadRequest(new { message = "According to the search criteria, nothing was found." });
            }

            return Ok(new { paymentMethods = paymentMethods, countPages = countPages });
        }
    }
}
