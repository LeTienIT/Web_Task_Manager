using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using api_task_management.Model;
using api_task_management.token;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;

namespace api_task_management.Controllers.Users
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private MyDbContext _db;

        public UsersController(MyDbContext db)
        {
            this._db = db;
        }

        public object Token_Api { get; private set; }
        [AllowAnonymous]
        [HttpPost("login")]
        public IActionResult Login([FromBody] api_task_management.Model.Users us)
        {
            if(ModelState.IsValid)
            {
                var user_key = this._db.UsersTB.FirstOrDefault(u=>u.username==us.username && u.password == us.password);
                if(user_key != null)
                {
                    var token = TokenApi.GenerateJwtToken(user_key.userid);
                    return Ok(new {status="OK",data = user_key, token=token});
                }
            }
            return Ok(new { status = "Login_Failed"}); 
        }
        [AllowAnonymous]
        [HttpPost("create")]
        public async Task<ActionResult> Post([FromBody] api_task_management.Model.Users us)
        {
            if(ModelState.IsValid)
            {
                var check_User = await this._db.UsersTB.Where(u => u.username == us.username).ToListAsync();
                if(check_User.Count <= 0)
                {
                    this._db.UsersTB.Add(us);
                    try
                    {
                        this._db.SaveChanges();

                        return Ok(new { status = "Ok", data = "Create successfully" });
                    }
                    catch (Exception)
                    {
                        return Ok(new { status = "Create_failed", data = "Failed to create user" });
                    }
                }
                else
                {
                    return Ok(new { status = "Error_user", data = "Username already exists" });
                }
            }

            return BadRequest(ModelState);
        }

        [HttpPut("update")]
        public async Task<ActionResult<api_task_management.Model.Users>> Put(api_task_management.Model.Users us)
        {
            if(ModelState.IsValid)
            {
                var user_update = await this._db.UsersTB.FindAsync(us.userid);
                if(user_update == null)
                {
                    return NotFound();
                }
                else
                {
                    user_update.fullname = us.fullname;
                    user_update.email = us.email;
                    user_update.password = us.password;
                    user_update.isadmin = us.isadmin;
                    try
                    {
                        await this._db.SaveChangesAsync();
                        return Ok(new { status = "Ok", data = "Update successfully" });
                    }
                    catch (Exception)
                    {
                        return Ok(new { status = "Update_failed", data = "Update failed" });
                    }
                }
            }
            return BadRequest(ModelState);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<api_task_management.Model.Users>> Delete(int id)
        {
            if(ModelState.IsValid)
            {
                var user_delete = await this._db.UsersTB.FindAsync(id);
                this._db.AuditLogsTB.RemoveRange(this._db.AuditLogsTB.Where(a => a.userid == id));
                if (user_delete == null)
                {
                    return NotFound();
                }
                else
                {
                    var list_project = await this._db.ProjectsTB.Where(t => t.userid == id).ToListAsync();
                    foreach (var p in list_project)
                    {
                        int projectID = p.projectid;
                        var list_task_remove = await this._db.TasksTB.Where(t => t.projectid == projectID).ToListAsync();
                        foreach (var task in list_task_remove)
                        {
                            int taskID = task.taskid;
                            this._db.NotesTB.RemoveRange(this._db.NotesTB.Where(a => a.taskid == taskID));

                            var taskToRemove = await this._db.TasksTB.Include(t => t.attachments).FirstOrDefaultAsync(t => t.taskid == taskID);
                            if (taskToRemove != null)
                            {
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
                        }
                        this._db.ProjectsTB.Remove(p);
                        try
                        {
                            await this._db.SaveChangesAsync();
                        }
                        catch (Exception)
                        {
                            StatusCode(404, "Dữ liệu không tìm thấy");
                        }
                    }
                    this._db.Remove(user_delete);
                    try
                    {
                        await this._db.SaveChangesAsync();
                        return Ok(new { status = "Ok", data = user_delete });
                    }
                    catch (Exception)
                    {
                        return Ok(new { status = "Delete_Failed", data = user_delete });
                    }
                }
            }
            return BadRequest(ModelState);
        }

        [HttpGet]
        public async Task<ActionResult<api_task_management.Model.Users[]>> GetAll()
        {
            if (ModelState.IsValid)
            {
                var tmp = await this._db.UsersTB.ToListAsync();
                return Ok(tmp);
            }
            return Ok(new { status = "Login_Failed" });
        }

        [HttpGet("GetById/{userID}")]
        public async Task<ActionResult<api_task_management.Model.Users>> GetById(int userID)
        {
            if(ModelState.IsValid)
            {
                var u = await this._db.UsersTB.FindAsync(userID);
                if(u == null)
                {
                    return NotFound("No user");
                }
                else
                {
                    return Ok(u);
                }
            }
            return BadRequest(ModelState);
        }

    }
}
