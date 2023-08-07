using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Store.Api.Data.Abstract;
using Store.Data.Constants;
using Store.Data.Models;

#pragma warning disable CS8604

namespace Store.Api.Controllers
{
    [Route(ConstRouteTitle.TYPES_ROUTE)]
    [ApiController]
    public class TypeController : ControllerBase
    {
        private readonly IType _type;
        private readonly IGetProduct _getProduct;

        public TypeController(IType type, IGetProduct getProduct)
        {
            _type = type;
            _getProduct = getProduct;
        }

        [HttpGet(ConstTitleMethods.LIST)]
        public async Task<IActionResult> GetTypes(int categoryId, int brandId)
        {
            var types = await _type.GetTypes(categoryId, brandId);
            if (types == null || types.Count < 1)
            {
                return BadRequest(new { message = "No types found." });
            }

            return Ok(new { types = types });
        }

        [HttpGet(ConstTitleMethods.TABLE)]
        public async Task<IActionResult> GetTableTypes(int currentPage)
        {
            var (countPages, types) = await _type.GetTableTypes(currentPage);
            if (types == null)
            {
                return BadRequest(new { message = "No types found." });
            }

            return Ok(new { countPages = countPages, types = types });
        }

        [HttpGet(ConstTitleMethods.PRODUCT_BRAND_BY_TYPE)]
        public async Task<IActionResult> GetProductsBrandsByType(int typeId, string brandsId = "", int currentPage = 1)
        {
            if (typeId == 0)
            {
                return BadRequest(new { message = "Invalid type data." });
            }

            var brandsIdArray = !string.IsNullOrEmpty(brandsId) ?
                brandsId.Trim(' ').Split(',').Select(int.Parse).ToList() :
                new List<int>();

            var (countPages, products) = await _getProduct.GetProductsBrandsByType(currentPage, typeId, brandsIdArray);
            if (products == null)
            {
                BadRequest(new { message = "There are no products according to the selected criteria!" });
            }

            var typesId = products.Select(i => i.TypeId).ToList();
            var types = await _type.GetTypesByBrand(typesId);
            if (types == null)
            {
                BadRequest(new { message = "There are no products according to the selected criteria!" });
            }

            var brandsByType = brandsIdArray != null ? brandsIdArray : new List<int>();

            return Ok(new { products = products, countPages = countPages, brandsByType = brandsByType, types = types }) ;
        }

        [HttpPost(ConstTitleMethods.CREATE)]
        public async Task<IActionResult> CreateType(TypeModel model)
        {
            if (model.CategoryId <= 0 && string.IsNullOrEmpty(model.Name))
            {
                return BadRequest(new { message = "Invalid type data." });
            }

            var status = await _type.CreateType(model);
            if (status.StatusCode == 0)
            {
                return BadRequest(new { message = status.StatusMessage });
            }

            return Ok(new { success = true, message = status.StatusMessage });
        }

        [HttpPost(ConstTitleMethods.EDIT)]
        public async Task<IActionResult> EditType(TypeModel model)
        {
            if (model.CategoryId <= 0 && string.IsNullOrEmpty(model.Name))
            {
                return BadRequest(new { message = "Invalid type data." });
            }

            var status = await _type.EditType(model);
            if (status.StatusCode == 0)
            {
                return BadRequest(new { message = status.StatusMessage });
            }

            return Ok(new { success = true, message = status.StatusMessage });
        }

        [HttpDelete(ConstTitleMethods.DELETE)]
        public async Task<IActionResult> DeleteType(int id)
        {
            var status = await _type.DeleteType(id);
            if (status.StatusCode == 0)
            {
                return BadRequest(new { message = status.StatusMessage });
            }

            return Ok(new { success = true, message = status.StatusMessage });
        }
    }
}
