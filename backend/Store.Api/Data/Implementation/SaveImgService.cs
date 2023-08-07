using Microsoft.AspNetCore.Http;
using System.IO;
using System.Threading.Tasks;
using System;
using Store.Api.Data.Abstract;

namespace Store.Api.Data.Implementation
{
    public class SaveImgService : ISaveImg
    {
        public async Task<string> SaveImg(IFormFile img)
        {
            if (img == null)
            {
                return string.Empty;
            }

            var fileName = Guid.NewGuid().ToString() + img.FileName;
            var path = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/img/");
            var fullPath = Path.Combine(path, fileName);
            var stream = new FileStream(fullPath, FileMode.Create);
            await img.CopyToAsync(stream);
            await stream.FlushAsync();

            return "/img/" + fileName;
        }
    }
}
