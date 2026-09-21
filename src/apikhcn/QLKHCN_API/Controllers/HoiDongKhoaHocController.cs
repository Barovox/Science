using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using QLKHCN_API.Data;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using System.Data;
using System.Security.Cryptography;
using QLKHCN_API.ViewModels;
using OfficeOpenXml.FormulaParsing.LexicalAnalysis;
using System.Linq;
using System.Text.Json;
using Microsoft.AspNetCore.Authorization;
using Newtonsoft.Json.Linq;
using Microsoft.AspNetCore.Authentication;

namespace QLKHCN_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class HoiDongKhoaHocController : ControllerBase
    {
        private readonly MyDbContext _context;
        private readonly IConfiguration _configuration;

        public HoiDongKhoaHocController(MyDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        [HttpGet("Get-all-HDKH")]
        [Authorize]
        public async Task<IActionResult> GetAllHDKH()
        {
            var token = Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
            var role = new JwtSecurityTokenHandler()
                            .ReadJwtToken(token)
                            .Claims.FirstOrDefault(c => c.Type == ClaimTypes.Role)?.Value;

            if (role == "HoiDongKhoaHoc")
            {
                return Unauthorized();
            }

            var user = await _context.HoiDongKhoaHoc.ToListAsync();
            return Ok(user);
        }

        private string GenerateJwtToken(string userId, string hoTen, string email, string chucdanh)
        {
            var authClaims = new List<Claim>
            {
                new Claim("ID", userId),
                new Claim("HoTen", hoTen),
                new Claim("Email", email),
                new Claim("ChucDanh", chucdanh),
                new Claim(ClaimTypes.Role, "HoiDongKhoaHoc"),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            };
            var authSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JWT:Secret"]));
            var token = new JwtSecurityToken(
                issuer: _configuration["JWT:ValidIssuer"],
                audience: _configuration["JWT:ValidAudience"],
                expires: DateTime.Now.AddDays(7),
                claims: authClaims,
                signingCredentials: new SigningCredentials(authSigningKey, SecurityAlgorithms.HmacSha256)
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        [HttpPost("login-by-email")]
        public async Task<IActionResult> LoginByEmail([FromBody] HoiDongKhoaHocLoginModel request)
        {
            HoiDongKhoaHoc user = null;
            bool isMoiHDKH = request.IsMoiHDKH ?? false;
            var authHeader = Request.Headers["Authorization"].ToString();

            if (!isMoiHDKH && !string.IsNullOrEmpty(authHeader) && authHeader.StartsWith("Bearer "))
            {
                var role = new JwtSecurityTokenHandler()
                            .ReadJwtToken(authHeader.Replace("Bearer ", ""))
                            .Claims.FirstOrDefault(c => c.Type == ClaimTypes.Role)?.Value ?? "";

                if (role == "HoiDongKhoaHoc")
                {
                    user = await _context.HoiDongKhoaHoc.FirstOrDefaultAsync(u => u.Email == request.Email && string.IsNullOrEmpty(u.MatKhau));
                }
            }
            else if (string.IsNullOrEmpty(request.MatKhau))
            {
                user = isMoiHDKH
                    ? await _context.HoiDongKhoaHoc.FirstOrDefaultAsync(u => u.Email == request.Email)
                    : await _context.HoiDongKhoaHoc.FirstOrDefaultAsync(u => u.Email == request.Email && string.IsNullOrEmpty(u.MatKhau));
            }
            else if (!string.IsNullOrEmpty(request.MatKhau))
            {
                
                user = await _context.HoiDongKhoaHoc.FirstOrDefaultAsync(u => u.Email == request.Email && !string.IsNullOrEmpty(u.MatKhau));
                if (user == null || !VerifyPassword(request.MatKhau, user.MatKhau))
                {
                    return BadRequest(new { message = "Tài khoản không hợp lệ" });
                }
            }

            if (user == null)
            {
                return BadRequest(new { message = "Tài khoản không tồn tại" });
            }

            string chucdanh = user.ChucDanh ?? "0";
            var token = GenerateJwtToken(user.ID.ToString(), user.HoTen, user.Email, chucdanh);
            var jwtToken = new JwtSecurityTokenHandler().ReadJwtToken(token);

            return Ok(new
            {
                token,
                expiration = jwtToken.ValidTo,
            });
        }

        [HttpGet("required")]
        [Authorize]
        public async Task<IActionResult> GetRequired()
        {
            var token = Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
            var email = new JwtSecurityTokenHandler()
                            .ReadJwtToken(token)
                            .Claims.FirstOrDefault(c => c.Type == "Email")?.Value;

            var user = await _context.HoiDongKhoaHoc.FirstOrDefaultAsync(u => u.Email == email);
            if (string.IsNullOrEmpty(user.MatKhau))
            {
                return NotFound();
            }
            return Ok();
        }

        [HttpPost("Send")]
        [Authorize]
        public async Task<ActionResult<HoiDongKhoaHoc>> AddHoiDongKhoaHoc(HoiDongKhoaHoc hoiDongKhoaHoc)
        {
            bool isNameExist = await _context.HoiDongKhoaHoc.AnyAsync(x => x.Email == hoiDongKhoaHoc.Email);
            if (isNameExist)
            {
                return BadRequest(new { message = "Người dùng này đã tồn tại." });
            }
            if (!string.IsNullOrEmpty(hoiDongKhoaHoc.MatKhau))
            {
                hoiDongKhoaHoc.MatKhau = HashPassword(hoiDongKhoaHoc.MatKhau);
            }
            _context.HoiDongKhoaHoc.Add(hoiDongKhoaHoc);
            try
            {
                await _context.SaveChangesAsync();
                return Ok(hoiDongKhoaHoc);
            }
            catch (DbUpdateException)
            {
                return Conflict();
            }
        }

        [HttpGet("{id}")]
        [Authorize]
        public async Task<ActionResult<HoiDongKhoaHoc>> GetHoiDongKhoaHoc(int id)
        {
            var result = await _context.HoiDongKhoaHoc.FirstOrDefaultAsync(a => a.ID == id);

            if (result == null)
            {
                return NotFound();
            }

            return result;
        }

        [HttpPut("update-password")]
        [Authorize]
        public async Task<IActionResult> UpdatePassword([FromBody] HoiDongKhoaHocUpdateDto hoiDongKhoaHoc)
        {
            var user = await _context.HoiDongKhoaHoc.FirstOrDefaultAsync(u => u.ID == hoiDongKhoaHoc.ID && u.Email == hoiDongKhoaHoc.Email);
            if (user == null)
            {
                return NotFound(new { message = "Người dùng không tồn tại." });
            }
            if (!string.IsNullOrEmpty(hoiDongKhoaHoc.MatKhau))
            {
                user.MatKhau = HashPassword(hoiDongKhoaHoc.MatKhau);
            }
            await _context.SaveChangesAsync();
            return Ok(user);
        }

        [HttpPut("update-info")]
        [Authorize]
        public async Task<IActionResult> UpdateInfo([FromBody] HoiDongKhoaHocUpdateInfoDto hoiDongKhoaHoc)
        {
            var user = await _context.HoiDongKhoaHoc.FirstOrDefaultAsync(u => u.ID == hoiDongKhoaHoc.ID);
            if (user == null)
            {
                return NotFound(new { message = "Người dùng không tồn tại." });
            }

            user.HoTen = hoiDongKhoaHoc.HoTen;
            user.ChucDanh = hoiDongKhoaHoc.ChucDanh ?? "";
            user.LinhVucChuyenMon = hoiDongKhoaHoc.LinhVucChuyenMon ?? "";
            user.CoQuanCongTac = hoiDongKhoaHoc.CoQuanCongTac;
            user.QuocGia = hoiDongKhoaHoc.QuocGia ?? "";

            await _context.SaveChangesAsync();
            return Ok(user);
        }

        public static string HashPassword(string password)
        {
            // Tạo salt ngẫu nhiên
            byte[] salt = new byte[16];
            using (var rng = RandomNumberGenerator.Create())
            {
                rng.GetBytes(salt);
            }

            // Tạo hash với PBKDF2
            var pbkdf2 = new Rfc2898DeriveBytes(password, salt, 100_000, HashAlgorithmName.SHA256);
            byte[] hash = pbkdf2.GetBytes(32); // 256 bit

            // Kết hợp salt + hash thành một chuỗi base64
            byte[] hashBytes = new byte[48];
            Array.Copy(salt, 0, hashBytes, 0, 16);
            Array.Copy(hash, 0, hashBytes, 16, 32);
            return Convert.ToBase64String(hashBytes);
        }

        public static bool VerifyPassword(string password, string hashedPassword)
        {
            byte[] hashBytes = Convert.FromBase64String(hashedPassword);

            // Lấy salt từ hash
            byte[] salt = new byte[16];
            Array.Copy(hashBytes, 0, salt, 0, 16);

            // Hash lại mật khẩu người dùng nhập vào
            var pbkdf2 = new Rfc2898DeriveBytes(password, salt, 100_000, HashAlgorithmName.SHA256);
            byte[] hash = pbkdf2.GetBytes(32);

            // So sánh
            for (int i = 0; i < 32; i++)
            {
                if (hashBytes[i + 16] != hash[i])
                    return false;
            }
            return true;
        }

        [HttpPost]
        [Route("accept-invite")]
        public Task<IActionResult> AcceptInvite([FromBody] HDKHRequestActionItem data)
            => HandleInvite(data.request, data.idDanhMuc, "0", "Cập nhật thành công", data.from);

        [HttpPost]
        [Route("decline-invite")]
        public Task<IActionResult> DeclineInvite([FromBody] HDKHRequestActionItem data)
            => HandleInvite(data.request, data.idDanhMuc, "-1", "Từ chối thành công", data.from);


        private async Task<IActionResult> HandleInvite(string token, int idDanhMuc, string newStatus, string successMessage, string from)
        {
            var email = new JwtSecurityTokenHandler()
                            .ReadJwtToken(token)
                            .Claims.FirstOrDefault(c => c.Type == "Email")?.Value;

            var dmxdSV = await _context.DanhMucXetDuyetSinhVien.FirstOrDefaultAsync(b => b.IDDanhMuc == idDanhMuc);
            if (dmxdSV == null)
                return NotFound(new { message = "Không tìm thấy danh mục xét duyệt." });

            List<HDKHItem> reviewers;
            try
            {
                reviewers = JsonSerializer.Deserialize<List<HDKHItem>>(from == "xet-duyet" ? dmxdSV.danhSachHDXetDuyet : dmxdSV.danhSachHDNghiemThu);
            }
            catch (JsonException)
            {
                return BadRequest(new { message = "Dữ liệu JSON không hợp lệ." });
            }

            var reviewer = reviewers.FirstOrDefault(r => r.email == email && r.status == "-");
            if (reviewer == null)
                return BadRequest(new { message = "Cảm ơn Anh/Chị đã quan tâm đến thông tin này. Hiện tại lời mời đã được xử lý hoặc hết hạn truy cập." });

            reviewer.status = newStatus;

            if (from == "xet-duyet")
            {
                dmxdSV.danhSachHDXetDuyet = JsonSerializer.Serialize(reviewers);
            }
            else
            {
                dmxdSV.danhSachHDNghiemThu = JsonSerializer.Serialize(reviewers);
            }
            await _context.SaveChangesAsync();

            return Ok();
        }

    }
}
