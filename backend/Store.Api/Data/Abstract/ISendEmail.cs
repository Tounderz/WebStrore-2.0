using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Store.Data.Models;

namespace Store.Api.Data.Abstract
{
    public interface ISendEmail
    {
        Task<StatusModel> SendEmail(string email, string messageBody, string subject);
    }
}
