using System;

namespace UserManagementService.Data.Abstract
{
    public interface ISaveImg
    {
        Task<string> SaveImg(IFormFile img);
    }
}
