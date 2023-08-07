using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UserManagementService.Constants;
using UserManagementService.Data.Abstract;
using UserManagementService.Models;

namespace UserManagementService.Data.Implementation
{
    public class AccountRecoveryService : IAccountRecovery
    {
        private readonly UserDBContext _dbContext;
        private readonly ISendEmail _sendEmail;

        public AccountRecoveryService(UserDBContext dbContext, ISendEmail sendEmail)
        {
            _dbContext = dbContext;
            _sendEmail = sendEmail;
        }

        public async Task CheckAndDeleteExpiredAccounts()
        {
            using var transaction = await _dbContext.Database.BeginTransactionAsync(); //Начинает транзакцию базы данных с использованием BeginTransactionAsync()
            try
            {
                var expiredAccounts = await _dbContext.AccountDeletion.Where(u => DateTime.Compare(u.RecoveryExpirationDate, DateTime.UtcNow) < 0).ToListAsync();

                foreach (var account in expiredAccounts)
                {
                    await DeleteUserAndAccount(account);
                }

                await _dbContext.SaveChangesAsync();
                await transaction.CommitAsync(); //Завершает транзакцию, фиксируя операции удаления с использованием
            }
            catch (Exception)
            {
                await transaction.RollbackAsync(); //Eсли происходит ошибка, откатывает транзакцию с использованием RollbackAsync() и перебрасывает исключение для дальнейшей обработки.
                throw;
            }
        }

        public async Task<StatusModel> CreateToken(string email)
        {
            var status = new StatusModel();
            var model = await _dbContext.AccountDeletion.FirstOrDefaultAsync(i => i.UserEmail == email);
            if (model == null)
            {
                status.StatusCode = 0;
                status.StatusMessage = "Account not found";
                return status;
            }

            var dateCompare = DateTime.Compare(model.RecoveryExpirationDate, DateTime.Now);
            if (dateCompare < 0)
            {
                status = await DeleteUserAndAccount(model);
                if (status.StatusCode == 0)
                {
                    return status;
                }
                
                status.StatusCode = 0;
                status.StatusMessage = "Your account has been deleted due to expiration";
                return status;
            }

            model = new AccountRecoveryModel
            {
                DateExpiresToken = DateTime.Now.Date,
                RestoringToken = Guid.NewGuid().ToString()
            };

            var messageBody = MessageBodyRestoringAnAccount(model.RestoringToken);
            status = await _sendEmail.SendEmail(model.UserEmail, messageBody, ConstParameter.SUBJECK_RESTORING);
            if (status.StatusCode == 0)
            {
                return status;
            }
            
            status.StatusCode = 1;
            status.StatusMessage = "Your account has been marked as deleted. To regain access, please click on the account recovery link.";
            return status;
        }

        public async Task<StatusModel> GetUserByToken(string token)
        {
            var status = new StatusModel();
            var model = await _dbContext.AccountDeletion.FirstOrDefaultAsync(i => i.RestoringToken == token);
            if (model == null)
            {
                status.StatusCode = 0;
                status.StatusMessage = "Token not found";
                return status;
            }

            var dateCompare = DateTime.Compare(model.DateExpiresToken, DateTime.Now);
            if (dateCompare < 0)
            {
                status = await UpdateToken(token);
                if (status.StatusCode == 0)
                {
                    return status;
                }
                
                status.StatusCode = 0;
                status.StatusMessage = "An updated token has been sent to your email";
                return status;
            }

            status.StatusCode = 1;
            status.StatusMessage = "Token valid";
            return status;
        }

        public async Task<StatusModel> UpdateToken(string token)
        {
            var status = new StatusModel();
            var model = await _dbContext.AccountDeletion.FirstOrDefaultAsync(i => i.RestoringToken == token);
            if (model == null)
            {
                status.StatusCode = 0;
                status.StatusMessage = "Token not found";
                return status;
            }

            string messageBody = string.Empty;
            var dateCompare = DateTime.Compare(model.DateExpiresToken, DateTime.Now);
            if (dateCompare >= 0)
            {
                messageBody = MessageBodyRestoringAnAccount(model.RestoringToken);
                status = await _sendEmail.SendEmail(model.UserEmail, messageBody, ConstParameter.SUBJECK_RESTORING);
                return status;
            }

            model.RestoringToken = Guid.NewGuid().ToString();
            model.DateExpiresToken = DateTime.Now.AddDays(1).Date;
            messageBody = MessageBodyRestoringAnAccount(model.RestoringToken);
            status = await _sendEmail.SendEmail(model.UserEmail, messageBody, ConstParameter.SUBJECK_RESTORING);
            if (status.StatusCode == 0)
            {
                return status;
            }

            _dbContext.AccountDeletion.Update(model);
            await _dbContext.SaveChangesAsync();

            status.StatusCode = 1;
            status.StatusMessage = "An updated token has been sent to your email";
            return status;
        }

        public async Task<StatusModel> AccountRecovery(string token)
        {
            var status = new StatusModel();
            var model = await _dbContext.AccountDeletion.FirstOrDefaultAsync(i => i.RestoringToken == token);
            if (model == null)
            {
                status.StatusCode = 0;
                status.StatusMessage = "Token not found";
                return status;
            }

            var user = await _dbContext.User.FirstOrDefaultAsync(i => i.Email == model.UserEmail);
            if (user == null)
            {
                status.StatusCode = 0;
                status.StatusMessage = "Account not found";
                return status;
            }

            user.IsDeleted = false;
            _dbContext.AccountDeletion.Remove(model);
            _dbContext.User.Update(user);
            await _dbContext.SaveChangesAsync();

            status.StatusCode = 1;
            status.StatusMessage = "Account successfully restored";
            return status;
        }

        public async Task<StatusModel> AccountRecoveryByAdmin(int userId)
        {
            var status = new StatusModel();
            var user = await _dbContext.User.FirstOrDefaultAsync(i => i.Id == userId);
            if (user == null )
            {
                status.StatusCode = 0;
                status.StatusMessage = "User not found";
                return status;
            }

            var model = await _dbContext.AccountDeletion.FirstOrDefaultAsync(i => i.UserEmail == user.Email);
            if (model == null)
            {
                status.StatusCode = 0;
                status.StatusMessage = "Token not found";
                return status;
            }

            user.IsDeleted = false;
            _dbContext.AccountDeletion.Remove(model);
            _dbContext.User.Update(user);
            await _dbContext.SaveChangesAsync();

            status.StatusCode = 1;
            status.StatusMessage = "Account successfully restored";
            return status;
        }

        private async Task<StatusModel> DeleteUserAndAccount(AccountRecoveryModel account)
        {
            var status = new StatusModel();
            var user = await _dbContext.User.FirstOrDefaultAsync(i => i.Email == account.UserEmail);
            if (user == null)
            {
                status.StatusCode = 0;
                status.StatusMessage = "Account not found";
                return status;
            }

            _dbContext.User.Remove(user);
            _dbContext.AccountDeletion.Remove(account);
            await _dbContext.SaveChangesAsync();

            status.StatusCode = 1;
            status.StatusMessage = "Your account has been deleted due to expiration";
            return status;
        }

        public string MessageBodyRestoringAnAccount(string token)
        {
            var link = $"http://localhost:3000/restore?token={token}";
            var messageBody = $"Confirm your account Please confirm your account by clicking <a href={link}>{link}</a>";
            return messageBody;
        }
    }
}
