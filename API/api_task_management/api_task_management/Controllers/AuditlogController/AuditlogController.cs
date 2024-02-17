using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using api_task_management.Model;
using api_task_management.token;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;

namespace api_task_management.Controllers.AuditlogController
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class AuditlogController : ControllerBase
    {
        private MyDbContext _db;
        public AuditlogController(MyDbContext db)
        {
            this._db = db;
        }

        [HttpGet("getAuditlog")]
        public async Task<ActionResult<AuditLog[]>> Get()
        {
            if(ModelState.IsValid)
            {
                var adl_tmp = await this._db.AuditLogsTB.ToListAsync();
                return Ok(adl_tmp);
            }
            return BadRequest(ModelState);
        }
        [AllowAnonymous]
        [HttpPost("CreateAuditlog")]
        public async Task<IActionResult> Post([FromBody] AuditLog a)
        {

            if (ModelState.IsValid)
            {
                a.timestamp = DateTime.Now;
                a.timestamp = DateTime.ParseExact(a.timestamp.ToString("yyyy-MM-dd"), "yyyy-MM-dd", null);
                a.timestamp = a.timestamp.AddHours(00).AddMinutes(00).AddSeconds(00).AddMilliseconds(00);
                a.timestamp = a.timestamp.ToUniversalTime();
                this._db.AuditLogsTB.Add(a);
                try
                {
                    await this._db.SaveChangesAsync();
                    return Ok(new {data ="Create_Auditlog"});
                }
                catch (Exception)
                {
                    return NotFound(new { data = "failed"});
                }
            }
            return BadRequest(ModelState);
        }
    }
}
