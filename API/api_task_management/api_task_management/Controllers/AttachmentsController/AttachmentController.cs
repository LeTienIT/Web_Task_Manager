using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using api_task_management.Model;
using Microsoft.AspNetCore.Authorization;
using System.Globalization;

namespace api_task_management.Controllers.AttachmentsController
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class AttachmentController : ControllerBase
    {
        private MyDbContext _db;
        public AttachmentController(MyDbContext db)
        {
            this._db = db;
        }
        [HttpPost("CreateAttachment/")]
        public async Task<IActionResult> Post([FromBody] Attachments a)
        {
            if(ModelState.IsValid)
            {
                await this._db.AttachmentsTB.AddAsync(a);
                try
                {
                    await this._db.SaveChangesAsync();
                    return Ok(new { data =  a});
                }
                catch (Exception)
                {
                    return Ok(new { data = "Create_Attachment_failed" });
                }
            }
            return BadRequest(ModelState);
        }
        [HttpDelete("DeleteAttachment/{attachmentID}")]
        public async Task<IActionResult> Delete(int attachmentID)
        {
            if(ModelState.IsValid)
            {
                var att = await this._db.AttachmentsTB.FindAsync(attachmentID);
                if(att != null)
                {
                    this._db.AttachmentsTB.Remove(att);
                    try
                    {
                        await this._db.SaveChangesAsync();
                        return Ok(new { data = att });
                    }
                    catch (Exception)
                    {
                        return Ok(new { data = "null" }); 
                    }
                }
            }
            return BadRequest(ModelState);
        }
    }
}
