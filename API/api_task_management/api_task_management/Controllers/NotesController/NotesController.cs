using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using api_task_management.Model;
using api_task_management.token;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;

namespace api_task_management.Controllers.NotesController
{
    [Route("api/[controller]")]
    [ApiController]
    public class NotesController : ControllerBase
    {
        private MyDbContext _db;
        public NotesController(MyDbContext db)
        {
            this._db = db;
        }

        [HttpPost("CreateNote")]
        public async Task<IActionResult> Create([FromBody] Notes t)
        {
            if (ModelState.IsValid)
            {
                t.timestamp = DateTime.Now;
                t.timestamp = DateTime.ParseExact(t.timestamp.ToString("yyyy-MM-dd"), "yyyy-MM-dd", null);
                t.timestamp = t.timestamp.AddHours(00).AddMinutes(00).AddSeconds(00).AddMilliseconds(00);
                t.timestamp = t.timestamp.ToUniversalTime();
                await this._db.NotesTB.AddAsync(t);
                try
                {
                    await this._db.SaveChangesAsync();
                    return Ok(new { data = t.noteid });
                }
                catch (Exception)
                {
                    return Ok(new { data = "Create_Note_failed" });
                }
            }
            return BadRequest(ModelState);
        }
        [HttpDelete("DeleteNote/{noteID}")]
        public async Task<IActionResult> Delete(int noteID)
        {
            if(ModelState.IsValid)
            {
                var note_delete = await this._db.NotesTB.FindAsync(noteID);
                if(note_delete != null)
                {
                    this._db.NotesTB.Remove(note_delete);
                    try
                    {
                        await this._db.SaveChangesAsync();
                        return Ok(new { data = note_delete.noteid });
                    }
                    catch (Exception)
                    {
                        return Ok(new { data = "DELETE_ERROR_NOTE" });
                    }
                }
                else
                {
                    return NotFound(new { data = "NOT_FOUND" });
                }
            }
            return BadRequest(ModelState);
        }
    }
}
