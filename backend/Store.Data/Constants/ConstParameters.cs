using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Store.Data.Constants
{
    public static class ConstParameters
    {
        public const string SHORT_PATH = "wwwroot/img/";
        public const string PATH_IMG = "/img/";
        public const int PLUS_ONE_VIEWING = 1;

        public const string ADMIN_ROLE = "admin";
        public const string MODERATOR_ROLE = "moderator";
        public const string USER_ROLE = "user";

        public const int LIMIT_TABLE_ONE_PAGE = 12;
        public const int LIMIN_ORDERS_ONE_PAGE = 10;

        public const int EXPIRES_REFRESH_TOKEN_DAYS = 7;
        public const int EXPIRES_ACCESS_TOKEN_MINUTES = 15;
    }
}