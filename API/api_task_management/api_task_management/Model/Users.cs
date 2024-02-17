
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace api_task_management.Model
{
    [Table("users")]
    public class Users
    {
        [Key]
        public int userid { get; set; }
        [Required]
        public string username { get; set; } = "";
        [Required]
        public string password { get; set; } = "";
        
        [MaxLength(255)]
        public string fullname { get; set; } = "";
        public string email { get; set; } = "";
        public int isadmin { get; set; } = 0;

    }
}
