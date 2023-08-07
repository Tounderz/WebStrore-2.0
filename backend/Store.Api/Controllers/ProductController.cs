using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Store.Api.Data.Abstract;
using Store.Data.Constants;
using Store.Data.Models.Dtos;

#pragma warning disable CS8601

namespace Store.Api.Controllers
{
    [Route(ConstRouteTitle.PRODUCTS_ROUTE)]
    [ApiController]
    public class ProductController : ControllerBase
    {
        private readonly ICUDProduct _cudProduct;
        private readonly IGetProduct _getProduct;

        public ProductController(ICUDProduct cudProduct, IGetProduct getProduct)
        {
            _cudProduct = cudProduct;
            _getProduct = getProduct;
        }

        [HttpGet(ConstTitleMethods.PRODUCT)]
        public async Task<IActionResult> GetProduct(int id)
        {
            var product = await _getProduct.GetProductById(id);
            if (product == null)
            {
                return BadRequest(new { message = "Failed to retrieve product with the specified Id." });
            }

            return Ok( new { product = product });
        }

        [HttpGet(ConstTitleMethods.LIST)]
        public async Task<IActionResult> GetProducts(int currentPage)
        {
            var (countPages, products) = await _getProduct.GetProductsTable(currentPage);
            if (products == null)
            {
                return BadRequest(new { message = "Failed to retrieve products." });
            }

            return Ok( new { products = products, countPages = countPages });
        }

        [HttpGet(ConstTitleMethods.PRODUCTS_BY_BRAND)]
        public async Task<IActionResult> GetProductsByBrand(int brandId)
        {
            var products = await _getProduct.GetProductsBrand(brandId);
            if (products == null)
            {
                return BadRequest(new { message = "Failed to retrieve products." });
            }

            return Ok(new { products = products });
        }

        [HttpGet(ConstTitleMethods.PRODUCTS_BY_CATEGORY)]
        public async Task<IActionResult> GetProductsByCategory(int categoryId)
        {
            var products = await _getProduct.GetProductsCategory(categoryId);
            if (products == null)
            {
                return BadRequest(new { message = "Failed to retrieve products." });
            }

            return Ok(new { products = products });
        }

        [HttpGet(ConstTitleMethods.PRODUCTS_BY_TYPE)]
        public async Task<IActionResult> GetProductsByType(int typeId)
        {
            var products = await _getProduct.GetProductsType(typeId);
            if (products == null)
            {
                return BadRequest(new { message = "Failed to retrieve products." });
            }

            return Ok(new { products = products });
        }

        [HttpPost(ConstTitleMethods.CREATE)]
        public async Task<IActionResult> CreateProduct()
        {
            var productDto = GetProductDto();
            if (productDto == null || string.IsNullOrEmpty(productDto.Name))
            {
                return BadRequest(new { message = "Invalid product data." });
            }

            var status = await _cudProduct.CreateProduct(productDto);
            if (status.StatusCode == 0)
            {
                return BadRequest(new { message = status.StatusMessage });
            }

            return Ok(new { success = true, message = status.StatusMessage });
        }

        [HttpPost(ConstTitleMethods.EDIT)]
        public async Task<IActionResult> EditProduct()
        {
            var productDto = GetProductDto();
            if (productDto == null)
            {
                return BadRequest(new { message = "Invalid product data." });
            }

            var status = await _cudProduct.EditProduct(productDto);
            if (status.StatusCode == 0)
            {
                return BadRequest(new { message = status.StatusMessage });
            }

            return Ok(new { success = true, message = status.StatusMessage });
        }


        [HttpPost(ConstTitleMethods.BRAND_CHANGE_PRODUCTS)]
        public async Task<IActionResult> BrandChangeProducts(int brandId, string productsId)
        {
            var productsIdArray = !string.IsNullOrEmpty(productsId) ?
                productsId.Trim(' ').Split(',').Select(int.Parse).ToList() :
                new List<int>();
            if (productsIdArray.Count == 0 || brandId < 1)
            {
                return BadRequest(new { message = "" });
            }

            var status = await _cudProduct.BrandChangeProducts(brandId, productsIdArray);
            if (status.StatusCode == 0)
            {
                return BadRequest(new { message = status.StatusMessage });
            }

            return Ok(new { success = true, message = status.StatusMessage });
        }

        [HttpPost(ConstTitleMethods.CATEGORY_CHANGE_PRODUCTS)]
        public async Task<IActionResult> CategoryChangeProducts(int categoryId, string productsId)
        {
            var productsIdArray = !string.IsNullOrEmpty(productsId) ?
                productsId.Trim(' ').Split(',').Select(int.Parse).ToList() :
                new List<int>();
            if (productsIdArray.Count == 0 || categoryId < 1)
            {
                return BadRequest(new { message = "" });
            }

            var status = await _cudProduct.CategoryChangeProducts(categoryId, productsIdArray);
            if (status.StatusCode == 0)
            {
                return BadRequest(new { message = status.StatusMessage });
            }

            return Ok(new { success = true, message = status.StatusMessage });
        }

        [HttpPost(ConstTitleMethods.TYPE_CHANGE_PRODUCTS)]
        public async Task<IActionResult> TypeChangeProducts(int typeId, string productsId)
        {
            var productsIdArray = !string.IsNullOrEmpty(productsId) ?
                productsId.Trim(' ').Split(',').Select(int.Parse).ToList() :
                new List<int>();
            if (productsIdArray.Count == 0 || typeId < 1)
            {
                return BadRequest(new { message = "" });
            }

            var status = await _cudProduct.TypeChangeProducts(typeId, productsIdArray);
            if (status.StatusCode == 0)
            {
                return BadRequest(new { message = status.StatusMessage });
            }

            return Ok(new { success = true, message = status.StatusMessage });
        }

        [HttpDelete(ConstTitleMethods.DELETE)]
        public async Task<IActionResult> DeleteProduct(int id)
        {
            var status = await _cudProduct.DeleteProduct(id);
            if (status.StatusCode == 0)
            {
                return BadRequest(new { message = status.StatusMessage });
            }

            return Ok(new { success = true, message = status.StatusMessage });
        }

        [HttpDelete(ConstTitleMethods.DELETE_PRODUCTS)]
        public async Task<IActionResult> DeleteProducts(string productsId)
        {
            var productsIdArray = !string.IsNullOrEmpty(productsId) ?
               productsId.Trim(' ').Split(',').Select(int.Parse).ToList() :
               new List<int>();
            if (productsIdArray.Count == 0)
            {
                return BadRequest(new { message = "" });
            }

            var status = await _cudProduct.DeleteProducts(productsIdArray);
            if (status.StatusCode == 0)
            {
                return BadRequest(new { message = status.StatusMessage });
            }

            return Ok(new { success = true, message = status.StatusMessage });
        }

        [NonAction]
        private ProductDto GetProductDto()
        {
            var productDto = new ProductDto
            {
                Id = Request.Form.TryGetValue(ConstPropertyName.ID, out var idValue) &&
                     int.TryParse(idValue, out var id) ? id : 0,
                Name = Request.Form.TryGetValue(ConstPropertyName.NAME, out var name) ? name : string.Empty,
                CategoryId = Request.Form.TryGetValue(ConstPropertyName.CATEGORY_ID, out var categoryIdValue) &&
                             int.TryParse(categoryIdValue, out var categoryId) ? categoryId : 0,
                TypeId = Request.Form.TryGetValue(ConstPropertyName.TYPE_ID, out var typeIdValue) &&
                             int.TryParse(typeIdValue, out var typeId) ? typeId : 0,
                BrandId = Request.Form.TryGetValue(ConstPropertyName.BRAND_ID, out var brandIdValue) &&
                             int.TryParse(brandIdValue, out var brandId) ? brandId : 0,
                ShortDescription = Request.Form.TryGetValue(ConstPropertyName.SHORT_DESCRIPTION, out var shortDescription) ? shortDescription : string.Empty,
                IsFavourite = Request.Form.TryGetValue(ConstPropertyName.IS_FAVOURITE, out var isFavourite) ? isFavourite : string.Empty,
                Available = Request.Form.TryGetValue(ConstPropertyName.AVAILABLE, out var available) ? available : string.Empty,
                Price = Request.Form.TryGetValue(ConstPropertyName.PRICE, out var priceValue) &&
                        int.TryParse(priceValue, out var price) ? price : 0,
                CountView = Request.Form.TryGetValue(ConstPropertyName.COUNT_VIEW, out var countViewValue) &&
                             int.TryParse(countViewValue, out var countView) ? countView : 0,
                Img = Request.Form.Files.Count != 0 ? Request.Form.Files[0] : null
            };

            return productDto;
        }
    }
}