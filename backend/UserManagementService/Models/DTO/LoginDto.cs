﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

#pragma warning disable CS8618 

namespace UserManagementService.Models.DTO
{
    public class LoginDto
    {
        public string Login { get; set; }
        public string Password { get; set; }
    }
}
