using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
namespace api_task_management.Model
{
    [Table("notes")]
    public class Notes
    {
        [Key]
        public int noteid { get; set; }
        [ForeignKey("taskid")]
        public int taskid { get; set; }
        [ForeignKey("userid")]
        public int userid { get; set; }

        public string content { get; set; } = "";
        [Column(TypeName = "datetime2")]
        public DateTime timestamp { get; set; }
    }

}
