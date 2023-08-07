using UserManagementService.Models;

namespace UserManagementService.Data.Abstract
{
    public interface IConfirmEmail
    {
        Task DeleteUnconfirmedUsers();
        Task<StatusModel> CreateToken(string email);
        Task<StatusModel> ConfirmEmailService(string token);
        Task<StatusModel> UpdatingToken(string email);
        string MessageBodyConfirmEmail(string token);
    }
}
