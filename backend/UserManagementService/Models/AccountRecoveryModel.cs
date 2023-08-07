using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

#pragma warning disable CS8618

namespace UserManagementService.Models
{
    public class AccountRecoveryModel
    {
        public int Id { get; set; }
        public string UserEmail { get; set; }
        public DateTime RecoveryExpirationDate { get; set; }
        public string RestoringToken { get; set; }
        public DateTime DateExpiresToken { get; set; }
        public virtual UserModel User { get; set; }
    }
}
