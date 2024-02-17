using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using api_task_management.Model;
using Microsoft.AspNetCore.Authorization;
using System.Globalization;

namespace api_task_management.Controllers.FileController
{
    [Route("api/[controller]")]
    [ApiController]
    public class FileController : ControllerBase
    {
        [HttpPost]
        public IActionResult UploadFile([FromForm] IFormFile file, [FromForm] string folderA, [FromForm] string folderB)
        {
            if (file != null && file.Length > 0)
            {
                // Tạo đường dẫn thư mục lưu trữ dựa trên thông tin A và B
                var folderPath = Path.Combine("C:/Users/Admin/Desktop/Thuc_Tap_Sinh/Project/API/file_attachment", folderA, folderB);
                //var folderPath = Path.Combine("C:\\Users\\Admin\\Desktop\\Thuc_Tap_Sinh\\Project\\source\\task_management\\src\\assets", folderA, folderB);

                // Tạo thư mục nếu nó không tồn tại
                if (!Directory.Exists(folderPath))
                {
                    Directory.CreateDirectory(folderPath);
                }

                var filePath = Path.Combine(folderPath, file.FileName);
                if (System.IO.File.Exists(filePath))
                {
                    return BadRequest(new { message = "File already exists in the specified folder." });
                }
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    file.CopyTo(stream);
                }

                return Ok(new { data = filePath });
            }

            return BadRequest(new {data = "Bad Request"});
        }

        [HttpDelete("Delete")]
        public IActionResult DeleteFile(string filePath)
        {
            try
            {
                //var fullPath = Path.Combine(Directory.GetCurrentDirectory(), "files", filePath);
                string decodedFilePath = Uri.UnescapeDataString(filePath);

                if (System.IO.File.Exists(decodedFilePath))
                {
                    System.IO.File.Delete(decodedFilePath);
                    return Ok(new { Message = decodedFilePath });
                }
                else
                {
                    return NotFound(new { Message = decodedFilePath });
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = $"Error deleting file: {ex.Message}" });
            }
        }
    }

    public class DeleteFileModel
    {
        public string FilePath { get; set; }
    }
}
