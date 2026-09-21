using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QLKHCN_API.Data;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace QLKHCN_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class ThongBaoController : ControllerBase
    {
        private readonly MyDbContext _context;

        public ThongBaoController(MyDbContext context)
        {
            _context = context;
        }

        [HttpGet("Get/{IDUser}")]
        public async Task<IActionResult> GetUserNotifications(string IDUser)
        {
            var notifications = await _context.ThongBao
                .Where(n => n.UserId == IDUser)
                .OrderBy(n => n.IsRead)
                .ThenByDescending(n => n.CreatedAt)
                .Take(10) // Lấy giới hạn số lượng thông báo
                .ToListAsync();

            return Ok(notifications);
        }

        [HttpGet("Get/{IDUser}/unread")]
        public async Task<IActionResult> GetUserNotificationsUnread(string IDUser)
        {
            var notifications = await _context.ThongBao
                .Where(n => n.UserId == IDUser && !n.IsRead)
                .OrderByDescending(n => n.CreatedAt)
                .ToListAsync();

            return Ok(notifications);
        }

        [HttpPut("{notificationId}/read")]
        public async Task<IActionResult> MarkAsRead(int notificationId)
        {
            var notification = await _context.ThongBao.FindAsync(notificationId);

            if (notification == null)
                return NotFound();

            notification.IsRead = true;
            await _context.SaveChangesAsync();

            return Ok(new { message = "Notification marked as read." });
        }

        [HttpPut("{notificationId}/unread")]
        public async Task<IActionResult> MarkAsUnread(int notificationId)
        {
            var notification = await _context.ThongBao.FindAsync(notificationId);

            if (notification == null)
                return NotFound();

            notification.IsRead = false;
            await _context.SaveChangesAsync();

            return Ok(new { message = "Notification marked as unread." });
        }

        [HttpPost]
        public async Task<IActionResult> CreateNotification([FromBody] ThongBao notification)
        {
            if (notification == null)
                return BadRequest("Invalid data");

            notification.CreatedAt = DateTime.Now;
            notification.IsRead = false;

            _context.ThongBao.Add(notification);
            await _context.SaveChangesAsync();

            return Ok(notification);
        }

        [HttpDelete("{notificationId}")]
        public async Task<IActionResult> DeleteNotification(int notificationId)
        {
            var notification = await _context.ThongBao.FindAsync(notificationId);

            if (notification == null)
                return NotFound();

            _context.ThongBao.Remove(notification);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Notification deleted successfully." });
        }
    }
}
