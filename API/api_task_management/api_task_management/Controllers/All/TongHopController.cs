using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using api_task_management.Model;
using api_task_management.token;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;

namespace api_task_management.Controllers.All
{
    [Route("api/[controller]")]
    [ApiController]
    public class TongHopController : ControllerBase
    {
        private MyDbContext _db;

        public TongHopController(MyDbContext db)
        {
            this._db = db;
        }

        [HttpGet("GetID/{userID}")]
        public async Task<IActionResult> Get(int userID)
        {
            if(ModelState.IsValid)
            {
                DateTime curr = DateTime.Now;

                var projectSt = await this._db.ProjectsTB.Where(p => p.userid == userID).ToListAsync();

                var taskEn = await this._db.TasksTB.Where(t=>t.userid==userID).ToListAsync();

                var data = new { projectData = projectSt, taskData = taskEn };

                return Ok(new { data = data });

            }
            return BadRequest(ModelState);
        }
    }
}
