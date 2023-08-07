using UserManagementService.Constants;
using UserManagementService.Data.Abstract;

namespace UserManagementService.Data.Implementation
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
            var path = Path.Combine(Directory.GetCurrentDirectory(), "..", "Store.Api", "wwwroot", "img");
            var fullPath = Path.Combine(path, fileName);
            var stream = new FileStream(fullPath, FileMode.Create);
            await img.CopyToAsync(stream);
            await stream.FlushAsync();

            return ConstParameter.PATH_IMG + fileName;
        }
    }
}
