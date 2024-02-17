using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using api_task_management.Model;
using api_task_management.token;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;

namespace api_task_management.Controllers.ProjectsController
{ 
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class ProjectsController : ControllerBase
    {
        private MyDbContext _db;
        public ProjectsController(MyDbContext db)
        {
            this._db = db;
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Projects>> GetByUserID(int id)
        {
            if(ModelState.IsValid)
            {
                var List_project = await this._db.ProjectsTB.Where(p=>p.userid==id).ToListAsync();
                if(List_project.Count > 0)
                {
                    return Ok(List_project);
                }
                else
                {
                    return Ok(null);
                }
            }
            return BadRequest(ModelState);
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] Projects p)
        {
            if(ModelState.IsValid)
            {
                p.startdate = p.startdate.AddHours(00).AddMinutes(00).AddSeconds(00).AddMilliseconds(00);
                p.startdate = p.startdate.ToUniversalTime(); ;

                p.enddate = p.enddate.AddHours(00).AddMinutes(00).AddSeconds(00).AddMilliseconds(00);
                p.enddate = p.enddate.ToUniversalTime(); ;
                this._db.ProjectsTB.Add(p);
                try
                {
                    await this._db.SaveChangesAsync();
                    return Ok(new { status = "CREATE_PROJECT_SUCCESSFULLY", data = p.projectid });
                }
                catch (Exception)
                {
                    return Ok(new { status = "CREATE_PROJECT_FAILED", data = -1 }); 
                }
            }
            return BadRequest(ModelState);
        }

        [HttpGet("getbyID/{projectID}")]
        public async Task<IActionResult> GetByProjectID(int projectID)
        {
            if(ModelState.IsValid)
            {
                var prj = await this._db.ProjectsTB.FindAsync(projectID);
                if(prj!=null)
                {
                    return Ok(new { data = prj });
                }
                else
                {
                    return NotFound("null");
                }
            }
            return BadRequest(ModelState); 
        }

        [HttpPut("Update")]
        public async Task<IActionResult> Put([FromBody] Projects p)
        {
            if (ModelState.IsValid)
            {
                var p_update = await this._db.ProjectsTB.FindAsync(p.projectid);
                if(p_update != null)
                {
                    p_update.title = p.title;
                    p_update.description = p.description;

                    p.startdate = p.startdate.AddHours(00).AddMinutes(00).AddSeconds(00).AddMilliseconds(00);
                    p.startdate = p.startdate.ToUniversalTime(); ;

                    p.enddate = p.enddate.AddHours(00).AddMinutes(00).AddSeconds(00).AddMilliseconds(00);
                    p.enddate = p.enddate.ToUniversalTime();

                    p_update.startdate = p.startdate;
                    p_update.enddate = p.enddate;

                    p_update.visibility = p.visibility;

                    try
                    {
                        await this._db.SaveChangesAsync();
                        return Ok(new { status = "UPDATE_PROJECT_SUCCESSFULLY", data = p.projectid });
                    }
                    catch (Exception)
                    {
                        return Ok(new { status = "UPDATE_PROJECT_FAILED", data = -1 });
                    }

                }
                
            }
            return BadRequest(ModelState);
        }
        [HttpDelete("Delete_Project/{projectID}")]
        public async Task<IActionResult> Delete(int projectID)
        {
            if(ModelState.IsValid)
            {
                var project_remove = await this._db.ProjectsTB.FindAsync(projectID);
                if(project_remove == null)
                {
                    return NotFound("PROJECT_NOTFOUND");
                }
                var list_task_remove = await this._db.TasksTB.Where(t => t.projectid == projectID).ToListAsync();
                foreach(var task in list_task_remove)
                {
                    int taskID = task.taskid;
                    this._db.NotesTB.RemoveRange(this._db.NotesTB.Where(a => a.taskid == taskID));

                    var taskToRemove = this._db.TasksTB.Include(t => t.attachments).FirstOrDefault(t => t.taskid == taskID);
                    if (taskToRemove == null)
                    {
                        return NotFound(new { status = "TASK_NOT_FOUND" });
                    }

                    foreach (var attachment in taskToRemove.attachments)
                    {
                        string folderPath = attachment.filepath;
                        this._db.AttachmentsTB.Remove(attachment);
                        string decodedFilePath = Uri.UnescapeDataString(folderPath);

                        if (System.IO.File.Exists(decodedFilePath))
                        {
                            System.IO.File.Delete(decodedFilePath);
                        }
                    }
                    this._db.TasksTB.Remove(task);
                    try
                    {
                        await this._db.SaveChangesAsync();
                    }
                    catch (Exception)
                    {
                        StatusCode(404, "Dữ liệu không tìm thấy");
                    }

                }
                this._db.ProjectsTB.Remove(project_remove);
                try
                {
                    await this._db.SaveChangesAsync();
                    return Ok(new { data = "DELETE_PROJECT_SUCCESSFULLY" });
                }
                catch (Exception)
                {
                    return Ok(new { data = list_task_remove });
                }
            }
            return BadRequest(ModelState);
        }

        [AllowAnonymous]
        [HttpGet("GetByName/{name}")]
        public async Task<IActionResult> GetByName(string name)
        {
            string title = Uri.UnescapeDataString(name);
            if (ModelState.IsValid)
            {
                var projects = await this._db.ProjectsTB
                            .Where(p => p.title.Contains(title) && p.visibility)
                            .ToArrayAsync();
                return Ok(projects);
            }
            return BadRequest(ModelState);
        }
    }
}
