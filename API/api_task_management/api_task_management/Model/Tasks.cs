
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace api_task_management.Model
{
    [Table("tasks")]
    public class Tasks
    {
        [Key]
        public int taskid { get; set; }
        [ForeignKey("userid")]
        public int userid { get; set; }

        public string title { get; set; }

        public string description { get; set; }

        public int priority { get; set; }
        [Column(TypeName = "datetime2")]
        public DateTime deadline { get; set; }
        
        public int status { get; set; }
        [ForeignKey("projectid")]
        public int projectid { get; set; }

        [ForeignKey("taskid")]
        public List<Notes> notes { get; set; }
        [ForeignKey("taskid")]
        public List<Attachments> attachments { get; set; }
    }
}
