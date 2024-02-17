using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using api_task_management.Model;
using Microsoft.AspNetCore.Authorization;
using System.Globalization;

namespace api_task_management.Controllers.TasksController
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class TasksController : ControllerBase
    {
        private MyDbContext _db;
        public TasksController(MyDbContext db)
        {
            this._db = db;
        }

        [AllowAnonymous]
        [HttpGet("GetListTask/{projectID}")]
        public async Task<ActionResult<api_task_management.Model.Tasks[]>> GetTask(int projectID)
        {
            if(ModelState.IsValid)
            {
                var listTask = await this._db.TasksTB.Where(t=>t.projectid==projectID)
                    .OrderBy(t => t.priority).ToListAsync();
                if(listTask != null)
                {
                    return Ok(listTask);
                }
                else
                {
                    return NotFound("No data");
                }
            }
            return BadRequest(ModelState);
        }

        [HttpGet("GetTaskDetail/{projectID}")]
        public async Task<IActionResult> GetTaskDetail(int projectID)
        {
            if(ModelState.IsValid)
            {
                var task = await this._db.TasksTB.Where(t => t.taskid == projectID)
                                .Include(t => t.notes)
                                .Include(t => t.attachments)
                                .OrderBy(t => t.priority)
                                .Select(t => new
                                { 
                                   // task = new{
                                        taskid = t.taskid,
                                        userid = t.userid,
                                        title = t.title,
                                        description = t.description,
                                        priority=t.priority,
                                        deadline = t.deadline,
                                        status = t.status,
                                        projectid = t.projectid,
                                        notes = t.notes.Select(n => new
                                        {
                                            noteid = n.noteid,
                                            taskid = n.taskid,
                                            userid = n.userid,
                                            content = n.content,
                                            timestamp = n.timestamp
                                        }),
                                        attachments = t.attachments.Select(a => new
                                        {
                                            attachmentid = a.attachmentid,
                                            taskid = a.taskid,
                                            userid = a.userid,
                                            filename = a.filename,
                                            filepath = a.filepath
                                        })
                                   // }
                                })
                                .ToListAsync();
                if(task.Count > 0)
                {
                    return Ok(new { data = task });
                }
                else
                {
                    
                    return NotFound("Không tìm thấy dữ liệu");
                }
            }
            return BadRequest(ModelState);
        }

        [HttpPut("updateTask")]
        public async Task<IActionResult> Update(Tasks t)
        {
            if(ModelState.IsValid)
            {
                var task_tmp = await this._db.TasksTB.FindAsync(t.taskid);
                if(task_tmp != null)
                {
                    task_tmp.title = t.title;
                    task_tmp.description = t.description;
                    task_tmp.status = t.status;
                    task_tmp.priority = t.priority;
                    t.deadline = t.deadline.AddHours(00).AddMinutes(00).AddSeconds(00).AddMilliseconds(00);
                    task_tmp.deadline = t.deadline.ToUniversalTime(); ;
                    try
                    {
                        await this._db.SaveChangesAsync();
                        return Ok(new { data = "Uppdate_successfully" });
                    }
                    catch (Exception)
                    {
                        return Ok(new { data = "Update_failed" });
                    }
                }
                else
                {
                    return NotFound(new { data = "ERROR" });
                }
            }
            return BadRequest(ModelState);
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] Tasks[] t)
        {
            if(ModelState.IsValid)
            {
                int i = 0;
                if (t == null || t.Length == 0)
                {
                    return BadRequest("Danh sách công việc trống hoặc không hợp lệ.");
                }
                foreach (var task in t)
                {
                    task.deadline = task.deadline.AddHours(00).AddMinutes(00).AddSeconds(00).AddMilliseconds(00);
                    task.deadline = task.deadline.ToUniversalTime(); ;
                    this._db.TasksTB.Add(task);
                    try
                    {
                        await this._db.SaveChangesAsync();
                    }
                    catch (Exception)
                    {
                        return Ok(new { status = "CREATE_TASK_FAILED", data = 0 });
                    }
                    i++;
                }
                return Ok(new { status = "CREATE_TASK_SUCCESSFULLY", data = i });

            }
            return BadRequest(ModelState);
        }

        [HttpDelete("{taskID}")]
        public async Task<IActionResult> Delete(int taskID)
        {
            if(ModelState.IsValid)
            {
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
                this._db.TasksTB.Remove(taskToRemove);
                try
                {
                    await this._db.SaveChangesAsync();
                    return Ok(new { data = "DELETE_TASK_SUCCESSFULLY" });
                }
                catch (Exception)
                {
                    return Ok(new { data = "DELETE_TASK_FAILED" });
                }
            }
            return BadRequest(ModelState);
        }
    }
}
