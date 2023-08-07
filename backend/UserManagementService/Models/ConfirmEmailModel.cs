using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

#pragma warning disable CS8618

namespace UserManagementService.Models
{
    public class ConfirmEmailModel
    {
        public int Id { get; set; }
        public string ConfirmEmailToken { get; set; }
        public DateTime DateCreated { get; set; }
        public DateTime DateExpiresToken { get; set; }
        public string UserEmail { get; set; }
    }
}
