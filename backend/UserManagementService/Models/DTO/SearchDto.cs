#pragma warning disable CS8618

namespace UserManagementService.Models.DTO
{
    public class SearchDto
    {
        public string FieldTitle { get; set; }
        public string Criterion { get; set; }
        public int CurrentPage { get; set; }
    }
}
