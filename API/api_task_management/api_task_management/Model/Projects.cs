
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace api_task_management.Model
{
    [Table("projects")]
    public class Projects
    {
        [Key]
        public int projectid { get; set; }
        [Required]
        [ForeignKey("userid")]
        public int userid { get; set; }
        [Required]
        public string title { get; set; } = "";
        public string description { get; set; } = "";
        public DateTime startdate { get; set; }
        public DateTime enddate { get; set; }
        public Boolean visibility { get; set; } = true;

    }
}
