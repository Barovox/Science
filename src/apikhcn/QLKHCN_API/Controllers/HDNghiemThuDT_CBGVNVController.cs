using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using QLKHCN_API.Data;
using QLKHCN_API.ViewModels;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;
using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.AspNetCore.Mvc.Rendering;
using Newtonsoft.Json;

namespace QLKHCN_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class HDNghiemThuDT_CBGVNVController : ControllerBase
    {
        private readonly MyDbContext _context;

        public HDNghiemThuDT_CBGVNVController(MyDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        [Route("Get-all-time")]
        public async Task<ActionResult> GetAllByUserAllTime(DateTime startTimes)
        {
            try
            {
                // Lấy token từ header Authorization
                var token = Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
                // Giải mã token
                var handler = new JwtSecurityTokenHandler();
                var jwtToken = handler.ReadJwtToken(token);

                string? userId = jwtToken.Claims.FirstOrDefault(c => c.Type == "IDUser")?.Value;
                string? email = jwtToken.Claims.FirstOrDefault(c => c.Type == "Email")?.Value;

                var allResult = await _context.DanhMucXetDuyetSinhVien
                                        .Where(x => x.status.Contains("Đồng ý tài trợ") && x.status_hopDong.Contains("Đã ký hợp đồng KHCN"))
                                        .ToListAsync();

                var result = new List<DanhMucXetDuyetSinhVien>();

                foreach (var dmxd in allResult)
                {
                    // Bước 1: Kiểm tra theo groupUser
                    var danhSachTacGia = getAuthor(dmxd.groupUser ?? "");

                    if (!string.IsNullOrEmpty(userId) && danhSachTacGia.Contains(userId))
                    {
                        result.Add(dmxd);
                        continue;
                    }

                    // Bước 2: Nếu không có userId hoặc không trùng, kiểm tra theo email
                    if (!string.IsNullOrEmpty(email))
                    {
                        var emailsHDKH = getInvitedUser(dmxd.danhSachHDNghiemThu, false);
                        if (emailsHDKH.Contains(email))
                        {
                            result.Add(dmxd);
                        }
                    }
                }

                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        [Route("Get-by-id")]
        public async Task<ActionResult> GetById(int idDanhMuc)
        {
            try
            {
                // Lấy token từ header Authorization
                var token = Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
                // Giải mã token
                var handler = new JwtSecurityTokenHandler();
                var jwtToken = handler.ReadJwtToken(token);

                string? userId = jwtToken.Claims.FirstOrDefault(c => c.Type == "IDUser")?.Value;
                string? email = jwtToken.Claims.FirstOrDefault(c => c.Type == "Email")?.Value;
                string? role = jwtToken.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Role)?.Value;

                var dmxdsv = await _context.DanhMucXetDuyetSinhVien
                                        .Where(x => x.status.Contains("Đồng ý tài trợ") && x.status_hopDong.Contains("Đã ký hợp đồng KHCN"))
                                        .FirstOrDefaultAsync(b => b.IDDanhMuc == idDanhMuc);

                if (role == "Quyền cao nhất")
                {
                    return Ok(dmxdsv);
                }

                // Bước 1: Kiểm tra theo groupUser
                var danhSachTacGia = getAuthor(dmxdsv.groupUser ?? "");

                if (!string.IsNullOrEmpty(userId) && danhSachTacGia.Contains(userId))
                {
                    return Ok(dmxdsv);
                } else if (!string.IsNullOrEmpty(email))
                {
                    var emailsHDKH = getInvitedUser(dmxdsv.danhSachHDNghiemThu, true);
                    if (emailsHDKH.Contains(email))
                    {
                        return Ok(dmxdsv);
                    }
                }
                return BadRequest();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        [Route("Get-by-id-for-decline")]
        public async Task<ActionResult> GetByIdForDecline(int idDanhMuc)
        {
            try
            {
                var token = Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
                var handler = new JwtSecurityTokenHandler();
                var jwtToken = handler.ReadJwtToken(token);
                string email = jwtToken.Claims.FirstOrDefault(c => c.Type == "Email")?.Value;

                var dmxdsv = await _context.DanhMucXetDuyetSinhVien
                                        .Where(x => x.status.Contains("Đồng ý tài trợ") && x.status_hopDong.Contains("Đã ký hợp đồng KHCN"))
                                        .FirstOrDefaultAsync(b => b.IDDanhMuc == idDanhMuc);

                if (!string.IsNullOrEmpty(email))
                {
                    var emailsHDKH = getInvitedUser(dmxdsv.danhSachHDNghiemThu, false);
                    if (emailsHDKH.Contains(email))
                    {
                        return Ok(dmxdsv);
                    }
                }
                return BadRequest();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        [Route("Get-all")]
        public async Task<ActionResult> GetAllByUser(string? startTimes)
        {
            try
            {
                // Lấy token từ header Authorization
                var token = Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
                // Giải mã token
                var handler = new JwtSecurityTokenHandler();
                var jwtToken = handler.ReadJwtToken(token);

                string? userId = jwtToken.Claims.FirstOrDefault(c => c.Type == "IDUser")?.Value;
                string? email = jwtToken.Claims.FirstOrDefault(c => c.Type == "Email")?.Value;
                string? role = jwtToken.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Role)?.Value;

                List<DanhMucXetDuyetSinhVien> allResult;
                if (!String.IsNullOrEmpty(startTimes))
                {
                    // năm học theo 15/10 hằng năm
                    DateTime timeStart = new DateTime(int.Parse(startTimes), 10, 15);
                    DateTime timeEnd = timeStart.AddYears(1);

                    allResult = await _context.DanhMucXetDuyetSinhVien
                                .Where(x => x.status.Contains("Đồng ý tài trợ") && x.status_hopDong.Contains("Đã ký hợp đồng KHCN"))
                                .Where(b => b.dateSubmit_now.HasValue && (b.dateSubmit_now >= timeStart && b.dateSubmit_now < timeEnd))
                                .Where(c => c.dateSubmit_now != null)
                                .ToListAsync();
                }
                else
                {
                    allResult = await _context.DanhMucXetDuyetSinhVien
                                .Where(x => x.status.Contains("Đồng ý tài trợ") && x.status_hopDong.Contains("Đã ký hợp đồng KHCN"))
                                .Where(b => b.dateSubmit_now.HasValue)
                                .Where(c => c.dateSubmit_now != null)
                                .ToListAsync();
                }

                if (role == "Quyền cao nhất")
                {
                    return Ok(allResult);
                }

                var result = new List<DanhMucXetDuyetSinhVien>();

                foreach (var dmxd in allResult)
                {
                    // Bước 1: Kiểm tra theo groupUser
                    var danhSachTacGia = getAuthor(dmxd.groupUser ?? "");

                    if (!string.IsNullOrEmpty(userId) && danhSachTacGia.Contains(userId))
                    {
                        result.Add(dmxd);
                        continue;
                    }

                    // Bước 2: Nếu không có userId hoặc không trùng, kiểm tra theo email
                    if (!string.IsNullOrEmpty(email))
                    {
                        var emailsHDKH = getInvitedUser(dmxd.danhSachHDNghiemThu, true);
                        if (emailsHDKH.Contains(email))
                        {
                            result.Add(dmxd);
                        }
                    }
                }

                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        private List<string> getAuthor(string groupUser)
        {
            List<string> tacGias = new List<string>();

            string[] tacGiaItems = groupUser.Split('$');
            foreach (string tacGiaItem in tacGiaItems)
            {
                string[] tacGiaData = tacGiaItem.Split(';');
                if (tacGiaData.Length >= 2) // Chỉ cần kiểm tra xem có ít nhất 2 phần
                {
                    string hoTenFull = tacGiaData[1].Trim(); // Lấy phần tên đầy đủ và loại bỏ khoảng trắng thừa

                    if (hoTenFull.Contains("-")) // Kiểm tra nếu có dấu "-"
                    {
                        string userId = hoTenFull.Split('-')[0].Trim(); // Lấy phần trước dấu "-"
                        tacGias.Add(userId);
                    }
                }
            }

            return tacGias;
        }

        private List<string> getInvitedUser(string danhSachHDKH, bool isAccepted)
        {
            var danhSachEmail = new List<string>();

            if (string.IsNullOrWhiteSpace(danhSachHDKH))
            {
                return danhSachEmail; // Trả về mảng rỗng nếu NULL hoặc chuỗi trống
            }

            try
            {
                using (JsonDocument doc = JsonDocument.Parse(danhSachHDKH))
                {
                    if (doc.RootElement.ValueKind == JsonValueKind.Array)
                    {
                        foreach (var item in doc.RootElement.EnumerateArray())
                        {
                            if (!isAccepted)
                            {
                                if (item.TryGetProperty("email", out var emailProp) &&
                                emailProp.ValueKind == JsonValueKind.String)
                                {
                                    danhSachEmail.Add(emailProp.GetString()!);
                                }
                            } else
                            {
                                if (item.TryGetProperty("email", out var emailProp) &&
                                emailProp.ValueKind == JsonValueKind.String &&
                                item.TryGetProperty("status", out var statusProp) &&
                                statusProp.ValueKind == JsonValueKind.String && statusProp.GetString()! != "-" && statusProp.GetString()! != "-1")
                                {
                                    danhSachEmail.Add(emailProp.GetString()!);
                                }
                            }
                        }
                    }
                }
            }
            catch (System.Text.Json.JsonException)
            {
                // Có thể log lỗi nếu cần
                // JSON không hợp lệ, trả về danh sách rỗng
            }

            return danhSachEmail;
        }

        [HttpGet]
        [Route("Get-danh-sach-hd-nghiem-thu")]
        public async Task<ActionResult> GetDanhSachHDNghiemThu(int IDDanhMuc)
        {
            try
            {
                var danhSachHDNghiemThu = (
                    await _context.DanhMucXetDuyetSinhVien
                        .Where(x => x.status.Contains("Đồng ý tài trợ") && x.status_hopDong.Contains("Đã ký hợp đồng KHCN"))
                        .FirstOrDefaultAsync(p => p.IDDanhMuc == IDDanhMuc)
                ).danhSachHDNghiemThu;
                return Ok(danhSachHDNghiemThu);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        [Route("Get-lich-su-xu-ly")]
        public async Task<ActionResult> GetLichSuXuLy(int IDDanhMuc)
        {
            try
            {
                var lichSuXuLy = (
                    await _context.DanhMucXetDuyetSinhVien
                        .Where(x => x.status.Contains("Đồng ý tài trợ") && x.status_hopDong.Contains("Đã ký hợp đồng KHCN"))
                        .FirstOrDefaultAsync(p => p.IDDanhMuc == IDDanhMuc)
                ).lichSuXuLy;
                return Ok(lichSuXuLy);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        [Route("Add-hdnt-vao-bai-bao")]
        public async Task<ActionResult> AddHDNghiemThuVaoBaiBao([FromBody] DanhMucXetDuyetSinhVien danhMucXetDuyetSinhVien)
        {
            try
            {
                var existingDanhMuc = await _context.DanhMucXetDuyetSinhVien
                                                .Where(x => x.status.Contains("Đồng ý tài trợ") && x.status_hopDong.Contains("Đã ký hợp đồng KHCN"))
                                                .FirstOrDefaultAsync(p => p.IDDanhMuc == danhMucXetDuyetSinhVien.IDDanhMuc);
                if (existingDanhMuc != null)
                {
                    existingDanhMuc.danhSachHDNghiemThu = danhMucXetDuyetSinhVien.danhSachHDNghiemThu;
                    await _context.SaveChangesAsync();
                    return Ok(existingDanhMuc);
                }
                else
                {
                    return NotFound("Không tìm thấy danh mục để cập nhật.");
                }
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        [Route("count")]
        public async Task<ActionResult> Count()
        {
            try
            {
                // Lấy token từ header Authorization
                var token = Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
                // Giải mã token
                var handler = new JwtSecurityTokenHandler();
                var jwtToken = handler.ReadJwtToken(token);

                string? userId = jwtToken.Claims.FirstOrDefault(c => c.Type == "IDUser")?.Value;
                string? email = jwtToken.Claims.FirstOrDefault(c => c.Type == "Email")?.Value;

                var allResult = await _context.DanhMucXetDuyetSinhVien
                                        .Where(x => x.status.Contains("Đồng ý tài trợ") && x.status_hopDong.Contains("Đã ký hợp đồng KHCN"))
                                        .ToListAsync();

                int banThaoDangXuLy = 0;
                int banThaoDaXuLy = 0;
                int cacDeTaiCanMoiPhanBien = 0;
                int cacDeTaiCanMoiThemPhanBien = 0;
                int cacDeTaiDangTrongQuaTrinhPhanBien = 0;
                int cacDeTaiQuaThoiHanGuiKetQuaPhanBien = 0;
                int cacDeTaiYeuCauChinhSuaBoSungThongTin = 0;
                int cacDeTaiDuocCapKinhPhiTaiTro = 0;
                int cacDeTaiKhongDuocTaiTro = 0;
                int cacDeTaiDuocThongQuaCanChinhSua = 0;
                int cacDeTaiDuocThongQuaCanNopLai = 0;
                int cacDeTaiCanPhanBien = 0;
                int cacLoiMoiPhanBien = 0;

                foreach (var dmxd in allResult)
                {
                    // Bước 1: Kiểm tra theo groupUser
                    var danhSachTacGia = getAuthor(dmxd.groupUser ?? "");
                    if (!string.IsNullOrEmpty(userId) && danhSachTacGia.Contains(userId))
                    {
                        if (dmxd.status_nghiemThu != "Đã nghiệm thu" && dmxd.status_nghiemThu != "Hủy")
                        {
                            banThaoDangXuLy++;
                        }
                        if (dmxd.status_nghiemThu == "Đã nghiệm thu")
                        {
                            banThaoDaXuLy++;
                        }
                        if (dmxd.status_nghiemThu == "Đang thực hiện")
                        {
                            cacDeTaiCanMoiPhanBien++;
                            cacDeTaiCanMoiThemPhanBien++;
                            cacDeTaiCanPhanBien++;
                            cacDeTaiDangTrongQuaTrinhPhanBien++;
                        }
                        if (dmxd.status == "Nộp lại/Chỉnh sửa")
                        {
                            cacDeTaiYeuCauChinhSuaBoSungThongTin++;
                        }

                        continue;
                    }
                    // Bước 2: Nếu không có userId hoặc không trùng, kiểm tra theo email
                    if (!string.IsNullOrEmpty(email))
                    {
                        var emailsHDKH = getInvitedUser(dmxd.danhSachHDXetDuyet, true);
                        if (emailsHDKH.Contains(email))
                        {
                            if (dmxd.status_nghiemThu != "Đã nghiệm thu" && dmxd.status_nghiemThu != "Hủy")
                            {
                                banThaoDangXuLy++;
                            }
                            if (dmxd.status_nghiemThu == "Đã nghiệm thu")
                            {
                                banThaoDaXuLy++;
                            }
                            if (dmxd.status_nghiemThu == "Đang thực hiện")
                            {
                                cacDeTaiDangTrongQuaTrinhPhanBien++;
                            }
                        }
                    }
                }

                var result = new
                {
                    banThaoDangXuLy,
                    banThaoDaXuLy,
                    cacDeTaiCanMoiPhanBien,
                    cacDeTaiCanMoiThemPhanBien,
                    cacDeTaiDangTrongQuaTrinhPhanBien,
                    cacDeTaiQuaThoiHanGuiKetQuaPhanBien,
                    cacDeTaiYeuCauChinhSuaBoSungThongTin,
                    cacDeTaiDuocCapKinhPhiTaiTro,
                    cacDeTaiKhongDuocTaiTro,
                    cacDeTaiDuocThongQuaCanChinhSua,
                    cacDeTaiDuocThongQuaCanNopLai,
                    cacDeTaiCanPhanBien,
                    cacLoiMoiPhanBien
                };

                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
