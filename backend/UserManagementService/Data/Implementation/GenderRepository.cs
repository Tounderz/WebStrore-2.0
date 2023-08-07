using Microsoft.EntityFrameworkCore;
using UserManagementService.Constants;
using UserManagementService.Data.Abstract;
using UserManagementService.Models;
using UserManagementService.Models.DTO;

#pragma warning disable CS8619

namespace UserManagementService.Data.Implementation
{
    public class GenderRepository : IGender
    {
        private readonly UserDBContext _dbContext;

        public GenderRepository(UserDBContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<GenderModel?> GetGenderById(int genderId)
        {
            var gender = await _dbContext.Gender.FirstOrDefaultAsync(i => i.Id == genderId);
            if (gender == null)
            {
                return null;
            }

            return gender;
        }

        public async Task<List<GenderModel>?> GetAllGenders()
        {
            var genders = await _dbContext.Gender.ToListAsync();
            if (genders == null || genders.Count <= 0)
            {
                return null;
            }

            return genders;
        }

        public async Task<(int countPages, List<GenderModel> genders)> GetTableGenders(int currentPage)
        {
            var genders = await _dbContext.Gender.ToListAsync();
            if (genders == null || genders.Count < 1)
            {
                return (0, null);
            }

            var countPages = (int)Math.Ceiling(genders.Count / (double)ConstParameter.LIMIT_TABLE_ONE_PAGE);
            var start = ConstParameter.LIMIT_TABLE_ONE_PAGE * (currentPage - 1);
            genders = genders.Skip(start).Take(ConstParameter.LIMIT_TABLE_ONE_PAGE).ToList();

            return (countPages, genders);
        }

        public async Task<StatusModel> Create(GenderModel model)
        {
            var status = new StatusModel();
            var gender = new GenderModel
            {
                GenderName = model.GenderName
            };

            await _dbContext.Gender.AddAsync(gender);
            await _dbContext.SaveChangesAsync();

            status.StatusCode = 1;
            status.StatusMessage = "Gender created successfully.";
            return status;
        }

        public async Task<StatusModel> Edit(GenderModel model)
        {
            var status = new StatusModel();
            var gender = await _dbContext.Gender.FirstOrDefaultAsync(i => i.Id != model.Id);
            if (gender == null)
            {
                status.StatusCode = 0;
                status.StatusMessage = "Gender not found.";
                return status;
            }

            gender.GenderName = model.GenderName;

            _dbContext.Gender.Update(gender);
            await _dbContext.SaveChangesAsync();

            status.StatusCode = 1;
            status.StatusMessage = "Gender updated successfully.";
            return status;
        }

        public async Task<StatusModel> Delete(int genderId)
        {
            var status = new StatusModel();
            var gender = await _dbContext.Gender.FirstOrDefaultAsync(i => i.Id == genderId);
            if (gender == null)
            {
                status.StatusCode = 0;
                status.StatusMessage = "Gender not found.";
                return status;
            }

            var users = await _dbContext.User.Where(i => i.GenderId == genderId).ToListAsync();
            if (users.Count > 0)
            {
                status.StatusCode = 0;
                status.StatusMessage = "Cannot delete gender. There are users associated with this gender.";
                return status;
            }

            _dbContext.Gender.Remove(gender);
            await _dbContext.SaveChangesAsync();

            status.StatusCode = 1;
            status.StatusMessage = "Gender deleted successfully.";
            return status;
        }

        public async Task<StatusModel> IsGenderNameAvailable(string genderName)
        {
            var status = new StatusModel();
            var gender = await _dbContext.Gender.FirstOrDefaultAsync(i => i.GenderName.ToLower() == genderName.ToLower());
            if (gender != null)
            {
                status.StatusCode = 0;
                status.StatusMessage = "Gender name is not available.";
                return status;
            }

            status.StatusCode = 1;
            status.StatusMessage = "Gender name is available.";
            return status;
        }

        public async Task<StatusModel> ReplaceGenderWithUsers(ReplaceGenderDto dto)
        {
            var status = new StatusModel();

            // Получаем общую роль
            var commonGender = await _dbContext.Gender.FirstOrDefaultAsync(r => r.GenderName == dto.CurrentGenderName);
            if (commonGender == null)
            {
                status.StatusCode = 0;
                status.StatusMessage = "Common gender not found.";
                return status;
            }

            // Получаем новый пол
            var newGecnder = await _dbContext.Gender.FirstOrDefaultAsync(r => r.GenderName == dto.NewGenderName);
            if (newGecnder == null)
            {
                status.StatusCode = 0;
                status.StatusMessage = "New gender not found.";
                return status;
            }

            // Обновляем пол для пользователей с общей полом
            var usersToUpdate = await _dbContext.User.Where(u => u.GenderId == commonGender.Id).ToListAsync();
            if (usersToUpdate.Count <= 0 || usersToUpdate == null)
            {
                status.StatusCode = 0;
                status.StatusMessage = "No users with the common gender found.";
                return status;
            }

            foreach (var user in usersToUpdate)
            {
                user.GenderId = newGecnder.Id;
                _dbContext.User.Update(user);
            }

            await _dbContext.SaveChangesAsync();

            status.StatusCode = 1;
            status.StatusMessage = "Gender replaced successfully.";
            return status;
        }
    }
}
