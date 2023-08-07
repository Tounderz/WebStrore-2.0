using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UserManagementService.Models;

namespace UserManagementService.Data.Abstract
{
    public interface IPasswordRecovery
    {
        Task<StatusModel> CreateToken(string email);
        Task<StatusModel> UpdateToken(string email);
        Task<(StatusModel status, string email)> PasswordRecovery(string token);
        Task<StatusModel> TokenRemovalFromDB(string token);
        string MessageBodyRetrievePassword(string token);
    }
}
