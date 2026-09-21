using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QLKHCN_API.Data;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text.Json;
using System.Threading.Tasks;

namespace QLKHCN_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CaiDatHeThongController : ControllerBase
    {
        private readonly IWebHostEnvironment _hostingEnvironment;
        private readonly MyDbContext _context;

        public CaiDatHeThongController(MyDbContext context, IWebHostEnvironment hostingEnvironment)
        {
            _hostingEnvironment = hostingEnvironment;
            _context = context;
        }

        [Authorize(Roles = "Quyền cao nhất")]
        [HttpGet]
        [Route("Get-NamHoc")]
        public async Task<ActionResult<IEnumerable<CaiDatHeThong>>> GetNamHoc()
        {
            try
            {
                var record = await _context.CaiDatHeThong
                    .Where(x => x.id == "NamHoc")
                    .ToListAsync();
                
                return Ok(record);
            }
            catch (Exception ex)
            {
                return BadRequest(ex);
            }
        }

        [Authorize(Roles = "Quyền cao nhất")]
        [HttpPost]
        [Route("Save-NamHoc")]
        public async Task<ActionResult> SaveNamHoc([FromBody] string value)
        {
            try
            {
                var record = await _context.CaiDatHeThong
                    .FirstOrDefaultAsync(x => x.id == "NamHoc");
                if (record == null)
                {
                    record = new CaiDatHeThong { id = "NamHoc", value = value };
                    _context.CaiDatHeThong.Add(record);
                }
                else
                {
                    record.value = value;
                    _context.CaiDatHeThong.Update(record);
                }
                await _context.SaveChangesAsync();
                return Ok("Cập nhật thành công");
            }
            catch (Exception ex)
            {
                return BadRequest(ex);
            }
        }

        [Authorize(Roles = "Quyền cao nhất")]
        [HttpGet]
        [Route("Get-XuatDMXD")]
        public async Task<ActionResult<IEnumerable<CaiDatHeThong>>> GetXuatDMXD()
        {
            try
            {
                var record = await _context.CaiDatHeThong
                    .Where(x => x.id == "XuatDMXD")
                    .ToListAsync();

                return Ok(record);
            }
            catch (Exception ex)
            {
                return BadRequest(ex);
            }
        }

        [Authorize(Roles = "Quyền cao nhất")]
        [HttpPost]
        [Route("Save-XuatDMXD")]
        public async Task<ActionResult> SaveXuatDMXD([FromBody] string value)
        {
            try
            {
                var record = await _context.CaiDatHeThong
                    .FirstOrDefaultAsync(x => x.id == "XuatDMXD");
                if (record == null)
                {
                    record = new CaiDatHeThong { id = "XuatDMXD", value = value };
                    _context.CaiDatHeThong.Add(record);
                }
                else
                {
                    record.value = value;
                    _context.CaiDatHeThong.Update(record);
                }
                await _context.SaveChangesAsync();
                return Ok("Cập nhật thành công");
            }
            catch (Exception ex)
            {
                return BadRequest(ex);
            }
        }

        [Authorize]
        [HttpGet]
        [Route("Get-CaiDatKeKhai")]
        public async Task<ActionResult<IEnumerable<CaiDatHeThong>>> GetCaiDatKeKhai(string? key = null)
        {
            // Lấy token từ header Authorization
            var token = Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
            // Giải mã token
            var handler = new JwtSecurityTokenHandler();
            var jwtToken = handler.ReadJwtToken(token);

            string? role = jwtToken.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Role)?.Value;

            if (!string.IsNullOrEmpty(key))
            {
                var record = await _context.CaiDatHeThong
                    .FirstOrDefaultAsync(x => x.id == "KeKhai");

                if (record == null)
                {
                    return NotFound();
                }

                var data = JsonSerializer.Deserialize<Dictionary<string, object>>(record.value);

                if (data == null || !data.ContainsKey(key))
                {
                    return NotFound("Không tìm thấy " + key);
                }

                // Trả về giá trị theo key
                return Ok(new
                {
                    key,
                    value = data[key]
                });
            }
            else if (role == "Quyền cao nhất")
            {
                try
                {
                    var record = await _context.CaiDatHeThong
                        .Where(x => x.id == "KeKhai")
                        .ToListAsync();

                    return Ok(record);
                }
                catch (Exception ex)
                {
                    return BadRequest(ex);
                }
            }
            else
            {
                return NotFound();
            }
        }

        [Authorize(Roles = "Quyền cao nhất")]
        [HttpPost]
        [Route("Save-CaiDatKeKhai")]
        public async Task<ActionResult> SaveCaiDatKeKhai([FromBody] string value)
        {
            try
            {
                var record = await _context.CaiDatHeThong
                    .FirstOrDefaultAsync(x => x.id == "KeKhai");
                if (record == null)
                {
                    record = new CaiDatHeThong { id = "KeKhai", value = value };
                    _context.CaiDatHeThong.Add(record);
                }
                else
                {
                    record.value = value;
                    _context.CaiDatHeThong.Update(record);
                }
                await _context.SaveChangesAsync();
                return Ok("Cập nhật thành công");
            }
            catch (Exception ex)
            {
                return BadRequest(ex);
            }
        }
    }
}
