using System;
using System.Threading.Tasks;
using MimeKit;
using Store.Api.Data.Abstract;
using Store.Data.Models;
using Store.Data.Models.Configurations;

namespace Store.Api.Data.Implementation
{
    public class SendEmailService : ISendEmail
    {
        private readonly EmailConfiguration _emailConfig;

        public SendEmailService(EmailConfiguration emailConfig)
        {
            _emailConfig = emailConfig;
        }

        public async Task<StatusModel> SendEmail(string email, string messageBody, string subject)
        {
            using MailKit.Net.Smtp.SmtpClient client = new();
            var status = new StatusModel();
            try
            {
                var message = new MimeMessage();
                message.From.Add(new MailboxAddress(_emailConfig.UserName, "asd@asd.ru"));
                message.To.Add(new MailboxAddress("", email));
                message.Subject = subject;
                message.Body = new BodyBuilder()
                {
                    HtmlBody = messageBody
                }.ToMessageBody();


                await client.ConnectAsync(_emailConfig.SmtpServer, _emailConfig.Port, true);
                client.AuthenticationMechanisms.Remove("XOAUTH2");
                await client.AuthenticateAsync(_emailConfig.From, _emailConfig.Password);
                await client.SendAsync(message);

                status.StatusCode = 1;
                status.StatusMessage = "";
                return status;
            }
            catch (Exception)
            {
                status.StatusCode = 0;
                status.StatusMessage = "";
                return status;
            }
            finally
            {
                await client.DisconnectAsync(true);
                client.Dispose();
            }
        }
    }
}
