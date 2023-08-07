using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Store.Api.Data.Abstract;
using Store.Data.Constants;
using Store.Data.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Store.Api.Controllers
{
    [Route(ConstRouteTitle.PRODUCT_INFOS_ROUTE)]
    [ApiController]
    public class ProductInfosController : ControllerBase
    {
        private readonly IProductInfo _productInfo;

        public ProductInfosController(IProductInfo productInfo)
        {
            _productInfo = productInfo;
        }

        [HttpGet(ConstTitleMethods.INFO)]
        public async Task<IActionResult> GetInfoProduct(int productId)
        {
            var infoProducts = await _productInfo.GetProductInfos(productId);

            return Ok(new { info = infoProducts });
        }

        [HttpPost(ConstTitleMethods.CREATE)]
        public async Task<IActionResult> CreateInfo(ProductInfoModel model)
        {
            var status = await _productInfo.CreateProductInfo(model);
            if (status.StatusCode == 0)
            {
                return BadRequest(new { message = status.StatusMessage });
            }

            return Ok(new { success = true, message = status.StatusMessage });
        }


        [HttpPost(ConstTitleMethods.EDIT)]
        public async Task<IActionResult> EditInfo(ProductInfoModel model)
        {
            var status = await _productInfo.EditProductInfo(model);
            if (status.StatusCode == 0)
            {
                return BadRequest(new { message = status.StatusMessage });
            }

            return Ok(new { success = true, message = status.StatusMessage });
        }

        [HttpDelete(ConstTitleMethods.DELETE)]
        public async Task<IActionResult> DeleteInfo(int id)
        {
            var status = await _productInfo.DeleteInfo(id);
            if (status.StatusCode == 0)
            {
                return BadRequest(new { message = status.StatusMessage });
            }

            return Ok(new { success = true, message = status.StatusMessage });
        }

        [HttpDelete(ConstTitleMethods.DELETE_INFOS)]
        public async Task<IActionResult> DeleteProductInfos(int productId)
        {
            var status = await _productInfo.DeleteProductInfos(productId);
            if (status.StatusCode == 0)
            {
                return BadRequest(new { message = status.StatusMessage });
            }


            return Ok(new { success = true, message = status.StatusMessage });
        }
    }
}
