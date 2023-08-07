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
    public class ConfirmEmailRepository : IConfirmEmail
    {
        private readonly UserDBContext _dbContext;
        private readonly ISendEmail _sendEmail;

        public ConfirmEmailRepository(UserDBContext dbContext, ISendEmail sendEmail)
        {
            _dbContext = dbContext;
            _sendEmail = sendEmail;
        }

        public async Task DeleteUnconfirmedUsers()
        {
            var expirationDate = DateTime.Now.AddMonths(-3);
            var unconfirmedEmails = await _dbContext.ConfirmEmail
                .Where(c => DateTime.Compare(c.DateCreated, expirationDate) < 0)
                .Select(c => c.UserEmail)
                .ToListAsync();

            var unconfirmedUsers = await _dbContext.User
                .Where(u => !u.IsConfirmEmail && unconfirmedEmails.Contains(u.Email))
                .ToListAsync();

            foreach (var user in unconfirmedUsers)
            {
                var confirmEmail = await _dbContext.ConfirmEmail.FirstOrDefaultAsync(c => c.UserEmail == user.Email);
                if (confirmEmail != null)
                {
                    _dbContext.ConfirmEmail.Remove(confirmEmail);
                }
                _dbContext.User.Remove(user);
            }

            await _dbContext.SaveChangesAsync();
        }


        public async Task<StatusModel> CreateToken(string email)
        {
            var status = new StatusModel();
            var confirmEmail = await _dbContext.ConfirmEmail.FirstOrDefaultAsync(i => i.UserEmail == email);
            if (confirmEmail != null)
            {
                status.StatusCode = 0;
                status.StatusMessage = "Email confirmation token already exists.";
                return status;
            }

            confirmEmail = new ConfirmEmailModel()
            {
                UserEmail = email,
                DateCreated = DateTime.Now.Date,
                ConfirmEmailToken = Guid.NewGuid().ToString(),
                DateExpiresToken = DateTime.Now.AddDays(1).Date,
            };

            var messageBody = MessageBodyConfirmEmail(confirmEmail.ConfirmEmailToken);
            status = await _sendEmail.SendEmail(email, messageBody, ConstParameter.SUBJECK_CONFIRM_EMAIL);
            if (status.StatusCode == 0)
            {
                return status;
            }

            await _dbContext.ConfirmEmail.AddAsync(confirmEmail);
            await _dbContext.SaveChangesAsync();

            status.StatusCode = 1;
            status.StatusMessage = "Email confirmation token created successfully.";
            return status;
        }

        public async Task<StatusModel> ConfirmEmailService(string token)
        {
            var status = new StatusModel();
            var confirmEmailModel = await _dbContext.ConfirmEmail.FirstOrDefaultAsync(i => i.ConfirmEmailToken == token);
            if (confirmEmailModel == null)
            {
                status.StatusCode = 0;
                status.StatusMessage = "Invalid email confirmation token.";
                return status;
            }

            var user = await _dbContext.User.FirstOrDefaultAsync(i => i.Email == confirmEmailModel.UserEmail);
            if (user == null)
            {
                status.StatusCode = 0;
                status.StatusMessage = "User not found.";
                return status;
            }

            var dateCompare = DateTime.Compare(confirmEmailModel.DateExpiresToken, DateTime.Now);
            if (dateCompare < 0)
            {
                status = await UpdatingToken(confirmEmailModel.UserEmail);
                return status;
            }

            user.IsConfirmEmail = true;
            _dbContext.User.Update(user);
            _dbContext.ConfirmEmail.Remove(confirmEmailModel);
            await _dbContext.SaveChangesAsync();

            status.StatusCode = 1;
            status.StatusMessage = "Email confirmed successfully.";
            return status;
        }

        public async Task<StatusModel> UpdatingToken(string email)
        {
            var status = new StatusModel();
            var model = await _dbContext.ConfirmEmail.FirstOrDefaultAsync(i => i.UserEmail == email);
            if (model == null)
            {
                status.StatusCode = 0;
                status.StatusMessage = "Confirm email record not found.";
                return status;
            }

            var messageBody = string.Empty;
            var dateCompare = DateTime.Compare(model.DateExpiresToken, DateTime.Now);
            if (dateCompare >= 0) 
            {
                messageBody = MessageBodyConfirmEmail(model.ConfirmEmailToken);
                status = await _sendEmail.SendEmail(email, messageBody, ConstParameter.SUBJECK_CONFIRM_EMAIL);
                if (status.StatusCode == 0)
                {
                    status.StatusCode = 0;
                    status.StatusMessage = "Failed to send confirmation email.";
                    return status;
                }
            }
            else
            {
                model.ConfirmEmailToken = Guid.NewGuid().ToString();
                model.DateExpiresToken = DateTime.Now.AddDays(1).Date;
                messageBody = MessageBodyConfirmEmail(model.ConfirmEmailToken);
                status = await _sendEmail.SendEmail(email, messageBody, ConstParameter.SUBJECK_CONFIRM_EMAIL);
                if (status.StatusCode == 0)
                {
                    status.StatusCode = 0;
                    status.StatusMessage = "Failed to send confirmation email.";
                    return status;
                }

                _dbContext.ConfirmEmail.Update(model);
                await _dbContext.SaveChangesAsync();
            }

            status.StatusCode = 1;
            status.StatusMessage = "Email confirmation token updated successfully.";
            return status;
        }

        public string MessageBodyConfirmEmail(string token)
        {
            var link = $"http://localhost:3000/verifyEmail?token={token}";
            var messageBody = $"Confirm your account Please confirm your account by clicking <a href={link}>{link}</a>";
            return messageBody;
        }
    }
}
