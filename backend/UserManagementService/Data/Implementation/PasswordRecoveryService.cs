using System;
using Microsoft.EntityFrameworkCore;
using UserManagementService.Constants;
using UserManagementService.Data.Abstract;
using UserManagementService.Models;

namespace UserManagementService.Data.Implementation
{
    public class PasswordRecoveryService : IPasswordRecovery
    {
        private readonly UserDBContext _dbContext;
        private readonly ISendEmail _sendEmail;

        public PasswordRecoveryService(UserDBContext dbContext, ISendEmail sendEmail)
        {
            _dbContext = dbContext;
            _sendEmail = sendEmail;
        }

        public async Task<StatusModel> CreateToken(string email)
        {
            var status = new StatusModel();
            var passwordRecovery = await _dbContext.PasswordRecovery.FirstOrDefaultAsync(i => i.Email == email);
            if (passwordRecovery != null)
            {
                status.StatusCode = 0;
                status.StatusMessage = "Password recovery token already exists.";
                return status;
            }

            passwordRecovery = new PasswordRecoveryModel 
            {
                RetrievePasswordToken = Guid.NewGuid().ToString(),
                DateExpiresToken = DateTime.Now.AddDays(1).Date,
                Email = email 
            };

            var messageBody = MessageBodyRetrievePassword(passwordRecovery.RetrievePasswordToken);
            status = await _sendEmail.SendEmail(email, messageBody, ConstParameter.SUBJECK_RETRIEVE_YOUR_PASSWORD);
            if (status.StatusCode == 0)
            {
                return status;
            }

            await _dbContext.PasswordRecovery.AddAsync(passwordRecovery);
            await _dbContext.SaveChangesAsync();

            status.StatusCode = 1;
            status.StatusMessage = "Password recovery request saved successfully";
            return status;
        }

        public async Task<(StatusModel status, string email)> PasswordRecovery(string token)
        {
            var status = new StatusModel();
            var passwordRecovery = await _dbContext.PasswordRecovery.FirstOrDefaultAsync(i => i.RetrievePasswordToken == token);
            if (passwordRecovery == null)
            {
                status.StatusCode = 0;
                status.StatusMessage = "Invalid token";
                return (status, "");
            }

            var dateCompare = DateTime.Compare(passwordRecovery.DateExpiresToken, DateTime.Now);
            if (dateCompare < 0)
            {
                status = await UpdateToken(passwordRecovery.Email);
                return (status, "");
            }

            status.StatusCode = 1;
            status.StatusMessage = "Valid token";
            return (status, passwordRecovery.Email);
        }

        public async Task<StatusModel> UpdateToken(string email)
        {
            var status = new StatusModel();
            var passwordRecovery = await _dbContext.PasswordRecovery.FirstOrDefaultAsync(i => i.Email == email);
            if (passwordRecovery == null)
            {
                status.StatusCode = 0;
                status.StatusMessage = "Invalid email";
                return status;
            }

            passwordRecovery.RetrievePasswordToken = Guid.NewGuid().ToString();
            var messageBody = MessageBodyRetrievePassword(passwordRecovery.RetrievePasswordToken);
            status = await _sendEmail.SendEmail(email, messageBody, ConstParameter.SUBJECK_RETRIEVE_YOUR_PASSWORD);
            if (status.StatusCode == 0)
            {
                return status;
            }

            passwordRecovery.DateExpiresToken = DateTime.Now.AddDays(1).Date;
            _dbContext.PasswordRecovery.Update(passwordRecovery);
            await _dbContext.SaveChangesAsync();

            status.StatusCode = 1;
            status.StatusMessage = "Token updated successfully";
            return status;
        }

        public async Task<StatusModel> TokenRemovalFromDB(string token)
        {
            var status = new StatusModel();
            var passwordRecovery = await _dbContext.PasswordRecovery.FirstOrDefaultAsync(i => i.RetrievePasswordToken == token);
            if (passwordRecovery == null)
            {
                status.StatusCode = 0;
                status.StatusMessage = "Invalid token";
                return status;
            }

            _dbContext.PasswordRecovery.Remove(passwordRecovery);
            await _dbContext.SaveChangesAsync();

            status.StatusCode = 1;
            status.StatusMessage = "Password recovery was successful";
            return status;
        }

        public string MessageBodyRetrievePassword(string token)
        {
            var link = $"http://localhost:3000/retrievePassword?token={token}";
            var messageBody = $"To recover your password, follow this link: <a href={link}>{link}</a>";
            return messageBody;
        }
    }
}
