using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

#pragma warning disable CS8618 

namespace UserManagementService.Models
{
    public class RefreshTokenModel
    {
        public int Id { get; set; }
        public int UserId { get; set; } //пользователь которому присвоен данный токен
        public string Token { get; set; } //рефреш токен
        public DateTime TokenExpires { get; set; } //дата окончания действия refreshToken
        public bool IsActive { get; set; } //валиднасть токена если false время токено истекло, и нужна повторная авторизация
        public virtual UserModel User { get; set; } //для быстрой инициализации зависимости в базе данных между таблицами User and RefreshToken
    }
}
