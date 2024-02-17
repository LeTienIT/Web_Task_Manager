
using Microsoft.EntityFrameworkCore;
using System;
namespace api_task_management.Model
{
    public class MyDbContext : DbContext
    {
        public DbSet<Users> UsersTB { get; set; }
        public DbSet<Projects> ProjectsTB { get; set; }
        public DbSet<Tasks> TasksTB { get; set; }
        public DbSet<Notes> NotesTB { get; set; }
        public DbSet<Attachments> AttachmentsTB { get; set; }
        public DbSet<AuditLog> AuditLogsTB { get; set; }
        public MyDbContext(DbContextOptions<MyDbContext> option) : base(option)
        {
            Console.WriteLine("Connected to the database!");
        }
    }
}
