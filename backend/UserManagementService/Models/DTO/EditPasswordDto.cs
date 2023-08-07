#pragma warning disable CS8618

namespace UserManagementService.Models.DTO
{
    public class EditPasswordDto
    {
        public int UserId { get; set; }
        public string CurrentPassword { get; set; }
        public string NewPassword { get; set; }

    }
}
