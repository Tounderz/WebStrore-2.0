using Microsoft.AspNetCore.Http;
using System.Threading.Tasks;

namespace Store.Api.Data.Abstract
{
    public interface ISaveImg
    {
        Task<string> SaveImg(IFormFile img);
    }
}
