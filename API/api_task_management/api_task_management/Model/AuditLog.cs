using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
namespace api_task_management.Model
{
    [Table("auditlog")]
    public class AuditLog
    {
        [Key]
        public int logid { get; set; }
        [ForeignKey("userid")]
        public int userid { get; set; }
        public string action { get; set; } = "";
        public string details { get; set; } = "";

        public DateTime timestamp { get; set; }
    }
}
