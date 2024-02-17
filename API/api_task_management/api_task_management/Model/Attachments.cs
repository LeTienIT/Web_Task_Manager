using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
namespace api_task_management.Model
{
    [Table("attachments")]
    public class Attachments
    {
        [Key]
        public int attachmentid { get; set; }
        [ForeignKey("taskid")]
        public int taskid { get; set; }
        [ForeignKey("userID")]

        public int userid { get; set; }

        public string filename { get; set; } = "";

        public string filepath { get; set; } = "";
    }
}
