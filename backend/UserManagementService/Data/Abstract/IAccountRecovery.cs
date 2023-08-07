using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UserManagementService.Models;

namespace UserManagementService.Data.Abstract
{
    public interface IAccountRecovery
    {
        Task CheckAndDeleteExpiredAccounts();
        Task<StatusModel> CreateToken(string email);
        Task<StatusModel> UpdateToken(string token);
        Task<StatusModel> GetUserByToken(string token);
        Task<StatusModel> AccountRecovery(string token);
        Task<StatusModel> AccountRecoveryByAdmin(int userId);
        string MessageBodyRestoringAnAccount(string token);
    }
}
