using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using QLKHCN_API.Data;
using QLKHCN_API.Data.HelpExport;
using QLKHCN_API.Extensions;
using QLKHCN_API.ViewModels;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.IO.Compression;
using System.Linq;
using System.Net;
using System.Threading.Tasks;

namespace QLKHCN_API.Controllers
{
    [Route("api/[controller]/")]
    [ApiController]
    [Authorize]
    public class DanhMucXetDuyetSinhVienController : ControllerBase
    {
        private readonly IWebHostEnvironment _hostingEnvironment;
        private readonly MyDbContext _context;

        public DanhMucXetDuyetSinhVienController(MyDbContext context, IWebHostEnvironment hostingEnvironment)
        {
            _hostingEnvironment = hostingEnvironment;
            _context = context;
        }

        [Authorize(Roles = "Quyền cao nhất, Quyền duyệt 1, Quyền duyệt 2, Quyền duyệt 3")]
        [HttpGet]
        [Route("Get-all")]
        public async Task<ActionResult<IEnumerable<DMXDSVViewModel>>> GetAllByQuyen(string quyen, string startTimes)
        {
            try
            {
                // năm học theo 15/10 hằng năm
                DateTime timeStart = new DateTime(int.Parse(startTimes), 10, 15);
                DateTime timeEnd = timeStart.AddYears(1);

                var result = new List<DanhMucXetDuyetSinhVien>();

                if (quyen != "Quyền cao nhất")
                {
                    result = await _context.DanhMucXetDuyetSinhVien
                                .Where(a => GetStatusKeywords(quyen).Contains(a.status) || GetStatusHopDongKeywords(quyen).Contains(a.status_hopDong) || GetStatusNghiemThuKeywords(quyen).Contains(a.status_nghiemThu))
                                .Where(b => b.dateSubmit >= timeStart && b.dateSubmit < timeEnd)
                                .ToListAsync();
                }
                else
                {
                    result = await _context.DanhMucXetDuyetSinhVien
                                .Where(b => b.dateSubmit >= timeStart && b.dateSubmit < timeEnd)
                                .ToListAsync();
                }

                    return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [Authorize(Roles = "Quyền cao nhất, Quyền duyệt 1, Quyền duyệt 2, Quyền duyệt 3")]
        [HttpGet]
        [Route("Get-all-nghiem-thu")]
        public async Task<ActionResult<IEnumerable<DMXDSVViewModel>>> GetAllNghiemThuByQuyen(string quyen, string startTimes)
        {
            try
            {
                // năm học theo 15/10 hằng năm
                DateTime timeStart = new DateTime(int.Parse(startTimes), 10, 15);
                DateTime timeEnd = timeStart.AddYears(1);

                var result = new List<DanhMucXetDuyetSinhVien>();

                if (quyen != "Quyền cao nhất")
                {
                    result = await _context.DanhMucXetDuyetSinhVien
                                .Where(a => a.status.Contains("Đồng ý tài trợ") && a.status_hopDong.Contains("Đã ký hợp đồng KHCN") && a.status_nghiemThu.Contains("Đã gửi hội đồng nghiệm thu"))
                                .Where(b => GetStatusKeywords(quyen).Contains(b.status) || GetStatusHopDongKeywords(quyen).Contains(b.status_hopDong) || GetStatusNghiemThuKeywords(quyen).Contains(b.status_nghiemThu))
                                .Where(c => c.dateSubmit >= timeStart && c.dateSubmit < timeEnd)
                                .ToListAsync();
                }
                else
                {
                    result = await _context.DanhMucXetDuyetSinhVien
                                .Where(a => a.status.Contains("Đồng ý tài trợ") && a.status_hopDong.Contains("Đã ký hợp đồng KHCN") && a.status_nghiemThu.Contains("Đã gửi hội đồng nghiệm thu"))
                                .Where(b => b.dateSubmit >= timeStart && b.dateSubmit < timeEnd)
                                .ToListAsync();
                }

                    return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        private List<string> GetStatusKeywords(string quyen)
        {
            switch (quyen)
            {
                case "Quyền duyệt 1":
                    return new List<string> { "Nộp lại/Chỉnh sửa", "Đã nộp hồ sơ", "Đã nhận hồ sơ", "Không tài trợ" };

                case "Quyền duyệt 2":
                    return new List<string> { "Đã nhận hồ sơ", "Đã gửi phản biện", "Không tài trợ" };

                case "Quyền duyệt 3":
                    return new List<string> { "Đã gửi phản biện", "Đồng ý tài trợ", "Không tài trợ" };

                default:
                    return new List<string>();
            }
        }

        private List<string> GetStatusHopDongKeywords(string quyen)
        {
            switch (quyen)
            {
                case "Quyền duyệt 1":
                    return new List<string> { "Chủ nhiệm kiểm tra, nộp lại hồ sơ và hợp đồng", "Đã nộp hồ sơ hoàn chỉnh + hợp đồng", "Đã ký hợp đồng KHCN + Tiến hành thực hiện đề tài", "Không tài trợ" };

                case "Quyền duyệt 2":
                    return new List<string> { "Chủ nhiệm kiểm tra, nộp lại hồ sơ và hợp đồng", "Đã nộp hồ sơ hoàn chỉnh + hợp đồng", "Đã ký hợp đồng KHCN + Tiến hành thực hiện đề tài", "Không tài trợ" };

                case "Quyền duyệt 3":
                    return new List<string> { "Chủ nhiệm kiểm tra, nộp lại hồ sơ và hợp đồng", "Đã nộp hồ sơ hoàn chỉnh + hợp đồng", "Đã ký hợp đồng KHCN + Tiến hành thực hiện đề tài", "Không tài trợ" };

                default:
                    return new List<string>();
            }
        }

        private List<string> GetStatusNghiemThuKeywords(string quyen)
        {
            switch (quyen)
            {
                case "Quyền duyệt 1":
                    return new List<string> { "Thông báo: Đến thời hạn nghiệm thu", "Đăng ký nghiệm thu/gia hạn/hủy", "Nộp lại/chỉnh sửa hồ sơ nghiệm thu, gia hạn, hủy", "Đã gửi hội đồng nghiệm thu", "Đã hoàn tất nghiệm thu", "Gia hạn thành công", "Thanh lý HỦY đề tài", "Thanh lý hợp đồng (đề tài đã nghiệm thu ĐẠT" };

                case "Quyền duyệt 2":
                    return new List<string> { "Thông báo: Đến thời hạn nghiệm thu", "Đăng ký nghiệm thu/gia hạn/hủy", "Nộp lại/chỉnh sửa hồ sơ nghiệm thu, gia hạn, hủy", "Đã gửi hội đồng nghiệm thu", "Đã hoàn tất nghiệm thu", "Gia hạn thành công", "Thanh lý HỦY đề tài", "Thanh lý hợp đồng (đề tài đã nghiệm thu ĐẠT)" };

                case "Quyền duyệt 3":
                    return new List<string> { "Thông báo: Đến thời hạn nghiệm thu", "Đăng ký nghiệm thu/gia hạn/hủy", "Nộp lại/chỉnh sửa hồ sơ nghiệm thu, gia hạn, hủy", "Đã gửi hội đồng nghiệm thu", "Đã hoàn tất nghiệm thu", "Gia hạn thành công", "Thanh lý HỦY đề tài", "Thanh lý hợp đồng (đề tài đã nghiệm thu ĐẠT)" };

                default:
                    return new List<string>();
            }
        }

        [HttpGet]
        [Route("Get-id")]
        public async Task<ActionResult<DanhMucXetDuyetSinhVien>> GetId(int IDDanhMuc)
        {
            var result = await _context.DanhMucXetDuyetSinhVien.FindAsync(IDDanhMuc);

            if (result == null)
            {
                return NotFound();
            }

            return result;
        }

        [HttpGet]
        [Route("Get-by-userid")]
        public async Task<ActionResult<IEnumerable<DanhMucXetDuyetSinhVien>>> GetByUserId(string userid, string startTimes)
        {
            try
            {
                // năm học theo 15/10 hằng năm
                DateTime timeStart = new DateTime(int.Parse(startTimes), 10, 15);
                DateTime timeEnd = timeStart.AddYears(1);

                var result = await _context.DanhMucXetDuyetSinhVien
                        .Where(a => a.groupUser.Contains(userid))
                        .Where(b => b.dateSubmit >= timeStart && b.dateSubmit < timeEnd)
                        .ToListAsync();
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [Authorize(Roles = "Quyền cao nhất, Quyền duyệt 1, Quyền duyệt 2, Quyền duyệt 3")]
        [HttpPut("{idDanhMuc}")]
        public async Task<IActionResult> changeStatus(int idDanhMuc, [FromBody] string status)
        {
            var userIdClaim = User.FindFirst("IDUser")?.Value;

            if (string.IsNullOrEmpty(userIdClaim))
            {
                return Unauthorized("User ID is missing or invalid.");
            }

            // Now userIdClaim contains the ID of the authenticated user
            var idUser = userIdClaim; // The extracted user ID

            try
            {
                var dmxd = await _context.DanhMucXetDuyetSinhVien.FirstOrDefaultAsync(a => a.IDDanhMuc == idDanhMuc);
                if (dmxd == null)
                {
                    return NotFound();
                }
                dmxd.status = status;
                if (status == "Đã nhận hồ sơ")
                {
                    dmxd.review1 = idUser;
                }
                else if (status == "Đã gửi phản biện")
                {
                    dmxd.review2 = idUser;
                }
                else if (status == "Không tài trợ")
                {
                    dmxd.rejectBy = idUser;
                    dmxd.completedBy = "";
                }
                else if (status == "Đồng ý tài trợ")
                {
                    dmxd.completedBy = idUser;
                    dmxd.rejectBy = "";
                }

                _context.Entry(dmxd).State = EntityState.Modified;
                await _context.SaveChangesAsync();
                return Ok(dmxd);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [Authorize(Roles = "Quyền cao nhất, Quyền duyệt 1, Quyền duyệt 2, Quyền duyệt 3")]
        [HttpPut("ChangeStatusHopDong/{idDanhMuc}")]
        public async Task<IActionResult> changeStatusHopDong(int idDanhMuc, [FromBody] string status_hopDong)
        {
            try
            {
                var dmxd = await _context.DanhMucXetDuyetSinhVien.FirstOrDefaultAsync(a => a.IDDanhMuc == idDanhMuc);
                if (dmxd == null)
                {
                    return NotFound();
                }
                dmxd.status_hopDong = status_hopDong;

                _context.Entry(dmxd).State = EntityState.Modified;
                await _context.SaveChangesAsync();
                return Ok(dmxd);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [Authorize(Roles = "Quyền cao nhất, Quyền duyệt 1, Quyền duyệt 2, Quyền duyệt 3")]
        [HttpPut("ChangeStatusNghiemThu/{idDanhMuc}")]
        public async Task<IActionResult> changeStatusNghiemThu(int idDanhMuc, [FromBody] string status_nghiemThu)
        {
            try
            {
                var dmxd = await _context.DanhMucXetDuyetSinhVien.FirstOrDefaultAsync(a => a.IDDanhMuc == idDanhMuc);
                if (dmxd == null)
                {
                    return NotFound();
                }
                dmxd.status_nghiemThu = status_nghiemThu;

                _context.Entry(dmxd).State = EntityState.Modified;
                await _context.SaveChangesAsync();
                return Ok(dmxd);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        [Route("GetStatusByIdDanhMuc/{idDanhMuc}")]
        [Authorize(Roles = "Quyền cao nhất, Quyền duyệt 1, Quyền duyệt 2, Quyền duyệt 3")]
        public async Task<IActionResult> GetStatusByIdDanhMuc(int idDanhMuc)
        {
            try
            {
                var dmxd = await _context.DanhMucXetDuyetSinhVien.FirstOrDefaultAsync(a => a.IDDanhMuc == idDanhMuc);
                if (dmxd == null)
                {
                    return NotFound();
                }
                return Ok(dmxd.status);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [Authorize(Roles = "Quyền cao nhất, Quyền duyệt 1, Quyền duyệt 2, Quyền duyệt 3")]
        [HttpPost("File-Status")]
        public async Task<IActionResult> changeFileStatus(int idDanhMuc, int fileIndex, int status)
        {
            try
            {
                var dmxdsv = await _context.DanhMucXetDuyetSinhVien.FirstOrDefaultAsync(a => a.IDDanhMuc == idDanhMuc);
                if (dmxdsv == null)
                {
                    return NotFound();
                }
                
                // giả sử dmxdsv.fileStatus = "-01", tách "-01" => "-", "0", "1"
                // truy cập trực tiếp vào các ký tự trong chuỗi bằng index
                
                // kiểm tra fileStatus không null và có đủ độ dài
                if (string.IsNullOrEmpty(dmxdsv.fileStatus))
                {
                    return BadRequest("fileStatus chưa có dữ liệu.");
                }

                var chars = dmxdsv.fileStatus.ToCharArray();

                if (fileIndex < 0 || fileIndex >= chars.Length)
                {
                    return BadRequest("fileIndex không hợp lệ.");
                }

                // cập nhật ký tự tại vị trí fileIndex
                chars[fileIndex] = status.ToString()[0];

                // gán lại chuỗi mới
                dmxdsv.fileStatus = new string(chars);

                // cập nhật trạng thái đề tài nếu có file từ chối
                if (status == 0)
                {
                    if (fileIndex >= 0 && fileIndex <= 2) // 3 file ở bước kê khai
                    {
                        dmxdsv.status = "Nộp lại/Chỉnh sửa";
                    }
                    else if (fileIndex >= 3 && fileIndex <= 5) // 3 file ở bước hợp đồng
                    {
                        dmxdsv.status_hopDong = "Nộp lại/Chỉnh sửa";
                    }
                    else if (fileIndex >= 6 && fileIndex <= 8) // 3 file ở bước nghiệm thu
                    {
                        dmxdsv.status_nghiemThu = "Nộp lại/Chỉnh sửa";
                    }
                    else if (fileIndex >= 9 && fileIndex <= 11) // 3 file ở bước thanh lý hợp đồng
                    {
                        dmxdsv.status_nghiemThu = "Nộp lại/Chỉnh sửa thanh lý";
                    }
                }

                _context.Update(dmxdsv);
                await _context.SaveChangesAsync();

                return Ok(dmxdsv);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        private List<IFTacGiaDmxdVmcs> ExtractTacGiaFromGroupUser(string groupUser)
        {
            List<IFTacGiaDmxdVmcs> tacGias = new List<IFTacGiaDmxdVmcs>();

            string[] tacGiaItems = groupUser.Split('$');
            foreach (string tacGiaItem in tacGiaItems)
            {
                string[] tacGiaData = tacGiaItem.Split(';');
                if (tacGiaData.Length >= 4)
                {

                    string[] phanTu = tacGiaData[1].Split(new char[] { '-', ' ' }, StringSplitOptions.RemoveEmptyEntries);
                    string ma = phanTu.Length > 0 ? phanTu[0] : "";
                    string ho = phanTu.Length > 1 ? string.Join(" ", phanTu.Skip(1).Take(phanTu.Length - 2)) : "";
                    string ten = phanTu.Length > 2 ? phanTu[phanTu.Length - 1] : "";
                    string coQuanCongTac = tacGiaData[2];
                    string vaiTro = tacGiaData[3];
                    string donggop = phanTu.Length > 2 ? phanTu[phanTu.Length - 1] : "";

                    IFTacGiaDmxdVmcs tacGia = new IFTacGiaDmxdVmcs
                    {
                        userId = ma,
                        ho = ho,
                        ten = ten,
                        dongGop = tacGiaData[3],
                        diem = tacGiaData[6],
                        tietChuan = tacGiaData[7]
                    };

                    tacGias.Add(tacGia);
                }
            }

            return tacGias;
        }

        [Authorize(Roles = "Quyền cao nhất, Quyền duyệt 1, Quyền duyệt 2, Quyền duyệt 3")]
        [HttpPut]
        [Route("Update-ghichu/{idDanhMuc}")]
        public async Task<IActionResult> GhiChu(int idDanhMuc, [FromBody] string ghichu)
        {
            try
            {
                var dmxdsv = await _context.DanhMucXetDuyetSinhVien.FirstOrDefaultAsync(a => a.IDDanhMuc == idDanhMuc);
                if (dmxdsv == null)
                {
                    return NotFound();
                }
                dmxdsv.ghiChu = ghichu;
                _context.Entry(dmxdsv).State = EntityState.Modified;
                await _context.SaveChangesAsync();
                return Ok(dmxdsv);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [Authorize(Roles = "Quyền cao nhất, Quyền duyệt 1, Quyền duyệt 2, Quyền duyệt 3")]
        [HttpPut]
        [Route("Update-admin-files/{idDanhMuc}")]
        public async Task<IActionResult> AdminFileUploaded(int idDanhMuc, [FromBody] List<string> fileList)
        {
            try
            {
                var dmxdsv = await _context.DanhMucXetDuyetSinhVien.FirstOrDefaultAsync(a => a.IDDanhMuc == idDanhMuc);
                if (dmxdsv == null)
                {
                    return NotFound();
                }
                dmxdsv.fileList = fileList;
                _context.Entry(dmxdsv).State = EntityState.Modified;
                await _context.SaveChangesAsync();
                return Ok(dmxdsv);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("Download_minhchung")]
        public async Task<IActionResult> DownloadImages(string dvct)
        {
            List<string> linkList = null;
            if (dvct != null)
            {
                linkList = await _context.DanhMucXetDuyetSinhVien
                    .Where(dv => dv.jci.Contains(dvct))
                    .Select(a => a.fileDangKy)
                    .ToListAsync();
            }
            using (var memoryStream = new MemoryStream())
            {
                using (var zipArchive = new ZipArchive(memoryStream, ZipArchiveMode.Create, true))
                {
                    foreach (var fileUrl in linkList)
                    {
                        using (var client = new WebClient())
                        {
                            try
                            {
                                byte[] imageBytes = client.DownloadData("https://khcn.uef.edu.vn" + fileUrl);
                                string fileName = Path.GetFileName("https://khcn.uef.edu.vn" + fileUrl);
                                var entry = zipArchive.CreateEntry(fileName, CompressionLevel.Optimal);

                                using (var entryStream = entry.Open())
                                {
                                    entryStream.Write(imageBytes, 0, imageBytes.Length);
                                }
                            }
                            catch (WebException ex)
                            {
                            }
                        }
                    }
                }

                memoryStream.Position = 0;

                return File(memoryStream.ToArray(), "application/zip", dvct + ".zip");
            }
        }

        [HttpGet]
        [Route("ExcelUserid")]
        public async Task<IActionResult> ExportToExcelDeTaiUser(string userid, int xuat, DateTime startTime)
        {
            DateTime targetDate = DateTime.Parse("2022-07-01 00:00:00.0000000");

            List<DanhMucXetDuyetSinhVien> cList;
            if (startTime == targetDate)
            {
                cList = await _context.DanhMucXetDuyetSinhVien
                                      .Where(a => a.groupUser.Contains(userid) &&
                                                  a.status_nghiemThu == "Đã nghiệm thu" &&
                                                  !a.dateSubmit_now.HasValue)
                                      .ToListAsync();
            }
            else
            {
                cList = await _context.DanhMucXetDuyetSinhVien
                                      .Where(a => a.groupUser.Contains(userid) &&
                                                  a.status_nghiemThu == "Đã nghiệm thu" &&
                                                  a.dateSubmit_now.HasValue &&
                                                  a.dateSubmit_now.Value.Date >= startTime.Date &&
                                                  a.dateSubmit_now.Value.Date <= startTime.AddYears(1).Date)
                                      .ToListAsync();
            }

            var user = await _context.NguoiDung.FindAsync(userid);
            var excelDataList = new List<ExeclDmxdUserVm>();

            foreach (var item in cList)
            {
                decimal total = Convert.ToDecimal(item.kinhPhi);
                decimal thue = total * 0.1m;
                decimal thunhap = total - thue;

                var iftg = GetIFTacgia(item.groupUser, userid);
                var temp = new ExeclDmxdUserVm
                {
                    userId = iftg.userId,
                    ho = iftg.ho,
                    ten = iftg.ten,
                    tenCongTrinh = item.tenBaiBao,
                    loaiCongTrinh = item.category,
                    soTacGia = item.quantity,
                    dongGop = iftg.dongGop,
                    tietChuan = iftg.tietChuan,
                    diem = iftg.diem,
                    khoa = user.DonViCongTac,
                    total = item.kinhPhi.ToString(),
                    thue = thue.ToString(),
                    thunhap = thunhap.ToString()
                };
                excelDataList.Add(temp);
            }

            if (xuat == 2)
            {
                string timestamp = DateTime.Now.ToString("dd-MM-yyyy HH:mm:ss", CultureInfo.InvariantCulture).ToUpper().Replace(':', '_').Replace('.', '_').Replace(' ', '_').Trim();
                var templateFileInfo = new FileInfo(Path.Combine(_hostingEnvironment.ContentRootPath, "Template", "Template_KhoaVien.xlsx"));
                var exportUserId = new ExportUserId();
                var stream = exportUserId.UpdateDataIntoExcelTemplateKhoaVien(excelDataList, templateFileInfo, DateTime.Now);
                return new FileStreamResult(stream, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
                {
                    FileDownloadName = "KhoaVien.xlsx"
                };
            }
            else if (xuat == 3)
            {
                string timestamp = DateTime.Now.ToString("dd-MM-yyyy HH:mm:ss", CultureInfo.InvariantCulture).ToUpper().Replace(':', '_').Replace('.', '_').Replace(' ', '_').Trim();
                var templateFileInfo = new FileInfo(Path.Combine(_hostingEnvironment.ContentRootPath, "Template", "Template_TRUONG.xlsx"));

                var exportUserId = new ExportUserId();
                var stream = exportUserId.UpdateDataIntoExcelTemplateTruong(excelDataList, templateFileInfo, DateTime.Now);
                return new FileStreamResult(stream, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
                {
                    FileDownloadName = "Truong.xlsx"
                };
            }
            else if (xuat == 4)
            {
                string timestamp = DateTime.Now.ToString("dd-MM-yyyy HH:mm:ss", CultureInfo.InvariantCulture).ToUpper().Replace(':', '_').Replace('.', '_').Replace(' ', '_').Trim();
                var templateFileInfo = new FileInfo(Path.Combine(_hostingEnvironment.ContentRootPath, "Template", "Template_TRUONG.xlsx"));

                var exportUserId = new ExportUserId();
                var stream = exportUserId.UpdateDataIntoExcelTemplateNCV2(excelDataList, templateFileInfo, DateTime.Now);
                return new FileStreamResult(stream, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
                {
                    FileDownloadName = "NCV2.xlsx"
                };
            }
            else
            {
                string timestamp = DateTime.Now.ToString("dd-MM-yyyy HH:mm:ss", CultureInfo.InvariantCulture).ToUpper().Replace(':', '_').Replace('.', '_').Replace(' ', '_').Trim();
                var templateFileInfo = new FileInfo(Path.Combine(_hostingEnvironment.ContentRootPath, "Template", "Template_NCM.xlsx"));

                var exportUserId = new ExportUserId();
                var stream = exportUserId.UpdateDataIntoExcelTemplateNCM(excelDataList, templateFileInfo, DateTime.Now);
                return new FileStreamResult(stream, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
                {
                    FileDownloadName = "NCM.xlsx"
                };
            }
        }

        [Authorize(Roles = "Quyền cao nhất, Quyền duyệt 1, Quyền duyệt 2, Quyền duyệt 3")]
        [HttpGet]
        [Route("Get-DonViCongTac_Excel")]
        public async Task<ActionResult<List<string>>> Excel_DonViCongTac()
        {
            try
            {
                var result = await _context.NguoiDung.Select(a => a.DonViCongTac)
                    .Distinct()
                    .ToListAsync();

                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        private IFTacGiaDmxdVmcs GetIFTacgia(string chuoitg, string userId)
        {
            string[] tacgias = chuoitg.Split('$');
            foreach (var tg in tacgias)
            {
                if (tg.Contains(userId))
                {
                    string[] a = tg.Split(';');
                    string[] phanTu = a[1].Split(new char[] { '-', ' ' }, StringSplitOptions.RemoveEmptyEntries);

                    string ma = phanTu.Length > 0 ? phanTu[0] : "";
                    string ho = phanTu.Length > 1 ? string.Join(" ", phanTu.Skip(1).Take(phanTu.Length - 2)) : "";
                    string ten = phanTu.Length > 2 ? phanTu[phanTu.Length - 1] : "";
                    string donggop = phanTu.Length > 2 ? phanTu[phanTu.Length - 1] : "";

                    var temp = new IFTacGiaDmxdVmcs
                    {
                        userId = ma,
                        ho = ho,
                        ten = ten,
                        dongGop = a[3],
                        diem = a[6],
                        tietChuan = a[7]
                    };
                    return temp;
                }
            }
            return null;
        }

        // TODO
        [Authorize(Roles = "Quyền cao nhất, Quyền duyệt 1, Quyền duyệt 2, Quyền duyệt 3")]
        [HttpGet]
        [Route("ExportToExcelDVCT")]
        public async Task<IActionResult> ExportToExcelDVCT(int xuat, string donViCongTac, string startTime)
        {
            // thời gian bắt đầu từ tháng 9 năm này
            DateTime timeStart = new DateTime(int.Parse(startTime), 9, 1);
            // Thời gian kết thúc là trước tháng 9 năm sau
            DateTime timeEnd = timeStart.AddYears(1);

            List<DMXDSVViewModel> danhMucXetDuyetList;
            danhMucXetDuyetList = await _context.DanhMucXetDuyetSinhVien
                .Join(
                    _context.NguoiDung,
                    dm => dm.userId,
                    nd => nd.IDUser,
                    (dm, nd) => new DMXDSVViewModel
                    {
                        IDDanhMuc = dm.IDDanhMuc,
                        category = dm.category,
                        userId = dm.userId,
                        tenBaiBao = dm.tenBaiBao,
                        groupUser = dm.groupUser,
                        status = dm.status,
                        status_hopDong = dm.status_nghiemThu,
                        status_nghiemThu = dm.status_nghiemThu,
                        quantity = dm.quantity,
                        HoTen = nd.HoTen,
                        DonViCongTac = nd.DonViCongTac,
                        jci = dm.jci,
                        dateSubmit_now = dm.dateSubmit_now
                    }
                )
                .Where(dm => dm.jci.Contains(donViCongTac) && dm.status_nghiemThu == "Đã nghiệm thu")
                .Where(b => b.dateSubmit_now.HasValue && b.dateSubmit_now.Value >= timeStart && b.dateSubmit_now < timeEnd)
                .ToListAsync();

            var excelDataList = new List<ExeclDmxdUserVm>();

            foreach (var item in danhMucXetDuyetList)
            {
                var tacGias = ExtractTacGiaFromGroupUser(item.groupUser);

                foreach (var tacGia in tacGias)
                {
                    var temp = new ExeclDmxdUserVm
                    {
                        userId = tacGia.userId,
                        ho = tacGia.ho,
                        ten = tacGia.ten,
                        tenCongTrinh = item.tenBaiBao,
                        loaiCongTrinh = item.category,
                        soTacGia = item.quantity,
                        dongGop = tacGia.dongGop,
                        tietChuan = tacGia.tietChuan,
                        diem = tacGia.diem,
                        jci = item.jci
                    };

                    excelDataList.Add(temp);
                    break;
                }
            }

            if (xuat == 2)
            {
                string timestamp = DateTime.Now.ToString("dd-MM-yyyy HH:mm:ss", CultureInfo.InvariantCulture).ToUpper().Replace(':', '_').Replace('.', '_').Replace(' ', '_').Trim();
                var templateFileInfo = new FileInfo(Path.Combine(_hostingEnvironment.ContentRootPath, "Template", "Template_KhoaVien.xlsx"));

                var stream = ExportKhoa.UpdateDataIntoExcelTemplateKhoaVien(excelDataList, templateFileInfo, DateTime.Now);

                return new FileStreamResult(stream, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
                {
                    FileDownloadName = "KhoaVien.xlsx"
                };
            }
            else
            {
                string timestamp = DateTime.Now.ToString("dd-MM-yyyy HH:mm:ss", CultureInfo.InvariantCulture).ToUpper().Replace(':', '_').Replace('.', '_').Replace(' ', '_').Trim();
                var templateFileInfo = new FileInfo(Path.Combine(_hostingEnvironment.ContentRootPath, "Template", "Template_NCM.xlsx"));

                var stream = ExportKhoa.UpdateDataIntoExcelTemplateNCM(excelDataList, templateFileInfo, DateTime.Now);

                return new FileStreamResult(stream, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
                {
                    FileDownloadName = "NCM.xlsx"
                };
            }
        }

        [Authorize(Roles = "Quyền cao nhất, Quyền duyệt 1, Quyền duyệt 2, Quyền duyệt 3")]
        [HttpPut("changeGroupuser/{idDanhMuc}")]
        public async Task<IActionResult> changeGroupuser(int idDanhMuc, [FromBody] string status)
        {
            try
            {
                var dmxdsv = await _context.DanhMucXetDuyetSinhVien.FirstOrDefaultAsync(a => a.IDDanhMuc == idDanhMuc);
                if (dmxdsv == null)
                {
                    return NotFound();
                }
                dmxdsv.groupUser = status;
                _context.Entry(dmxdsv).State = EntityState.Modified;
                await _context.SaveChangesAsync();
                return Ok(dmxdsv);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        /*[Authorize(Roles = "Quyền cao nhất")]*/
        [HttpDelete]
        [Route("Delete/{IDDanhMuc}")]
        public async Task<IActionResult> Delete(int IDDanhMuc)
        {
            var result = await _context.DanhMucXetDuyetSinhVien.FindAsync(IDDanhMuc);
            if (result == null)
            {
                return NotFound();
            }
            else if (result.status != "Đã nộp hồ sơ")
            {
                return BadRequest("Không xóa được lúc này");
            }

            _context.DanhMucXetDuyetSinhVien.Remove(result);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        /*[Authorize(Roles = "Quyền cao nhất, Quyền duyệt 1, Quyền duyệt 2, Quyền duyệt 3")]*/

        [HttpPut]
        [Route("Update/{IDDanhMuc}")]
        public async Task<IActionResult> Update(int IDDanhMuc, DanhMucXetDuyetSinhVien dmxd)
        {
            if (IDDanhMuc != dmxd.IDDanhMuc)
            {
                return BadRequest();
            }

            var existing = await _context.DanhMucXetDuyetSinhVien.FindAsync(IDDanhMuc);
            if (existing == null)
                return NotFound();

            // Dùng AutoMapNotNull
            dmxd.AutoMapNotNull(existing, "IDDanhMuc", "dateSubmit_now", "dateSubmit");

            existing.dateSubmit_now = DateTime.Now;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                return NotFound();
            }

            return NoContent();
        }

        [HttpPut]
        [Route("UpdateHopDong/{IDDanhMuc}")]
        public async Task<IActionResult> UpdateFileHopDong(int IDDanhMuc, [FromBody] DMXDSV_FileHopDong data)
        {
            if (IDDanhMuc != data.IDDanhMuc)
            {
                return BadRequest();
            }

            var dmxdsv = await _context.DanhMucXetDuyetSinhVien.FindAsync(IDDanhMuc);
            if (dmxdsv == null)
            {
                return NotFound();
            }

            dmxdsv.fileThuyetMinhHoanChinh = data.fileThuyetMinhHoanChinh;
            dmxdsv.fileHopDong = data.fileHopDong;
            dmxdsv.fileQuyetDinhGiaoNhiemVu = data.fileQuyetDinhGiaoNhiemVu;
            dmxdsv.fileStatus = data.fileStatus;
            dmxdsv.status_hopDong = "Đã nộp hồ sơ hoàn chỉnh + hợp đồng";
            dmxdsv.dateSubmit_now = DateTime.Now;

            _context.Entry(dmxdsv).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return Ok(dmxdsv);
        }

        [HttpPut]
        [Route("UpdateFileNghiemThu/{IDDanhMuc}")]
        public async Task<IActionResult> UpdateFileNghiemThu(int IDDanhMuc, [FromBody] DMXDSV_FileNghiemThu data)
        {
            if (IDDanhMuc != data.IDDanhMuc)
            {
                return BadRequest();
            }

            var dmxdsv = await _context.DanhMucXetDuyetSinhVien.FindAsync(IDDanhMuc);
            if (dmxdsv == null)
            {
                return NotFound();
            }

            dmxdsv.status_nghiemThu = "Đăng ký nghiệm thu/gia hạn/hủy";
            dmxdsv.fileThongTinNghiemThu = data.fileThongTinNghiemThu;
            dmxdsv.dateSubmit_now = DateTime.Now;

            _context.Entry(dmxdsv).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return Ok(dmxdsv);
        }

        [HttpPut]
        [Route("UpdateFileThanhLyHopDong/{IDDanhMuc}")]
        public async Task<IActionResult> UpdateFileThanhLyHopDong(int IDDanhMuc, [FromBody] DMXDSV_FileThanhLyHopDong data)
        {
            if (IDDanhMuc != data.IDDanhMuc)
            {
                return BadRequest();
            }

            var dmxdsv = await _context.DanhMucXetDuyetSinhVien.FindAsync(IDDanhMuc);
            if (dmxdsv == null)
            {
                return NotFound();
            }

            dmxdsv.fileThanhLyHopDong = data.fileThanhLyHopDong;
            dmxdsv.fileBaiBaoHopHoiDong = data.fileBaiBaoHopHoiDong;
            dmxdsv.fileQuyetDinhCongNhanDeTai = data.fileQuyetDinhCongNhanDeTai;
            dmxdsv.fileStatus = data.fileStatus;
            dmxdsv.dateSubmit_now = DateTime.Now;

            _context.Entry(dmxdsv).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return Ok(dmxdsv);
        }

        [HttpPost]
        [Route("Send")]
        public async Task<ActionResult<DanhMucXetDuyetSinhVien>> PostChiTietChungNhan(DanhMucXetDuyetSinhVien danhMucXetDuyetSV)
        {
            bool isNameExist = await _context.DanhMucXetDuyetSinhVien.AnyAsync(x => x.tenBaiBao == danhMucXetDuyetSV.tenBaiBao);
            if (isNameExist)
            {
                return BadRequest("Tên bài báo này đã tồn tại.");
            }
            danhMucXetDuyetSV.dateSubmit = DateTime.Now;
            danhMucXetDuyetSV.dateSubmit_now = DateTime.Now;
            _context.DanhMucXetDuyetSinhVien.Add(danhMucXetDuyetSV);
            try
            {
                await _context.SaveChangesAsync();
                return Ok(danhMucXetDuyetSV);
            }
            catch (DbUpdateException)
            {
                return Conflict();
            }
        }

        [HttpPost]
        [Route("Add-lich-su-xu-ly")]
        public async Task<ActionResult> AddLichSuXuLy([FromBody] LichSuXuLyItem lichSuMoi, [FromQuery] int idDanhMuc)
        {
            try
            {
                var danhMuc = await _context.DanhMucXetDuyetSinhVien.FirstOrDefaultAsync(p => p.IDDanhMuc == idDanhMuc);
                if (danhMuc == null)
                {
                    return NotFound("Không tìm thấy danh mục.");
                }

                List<LichSuXuLyItem> lichSuList = new List<LichSuXuLyItem>();

                if (!string.IsNullOrEmpty(danhMuc.lichSuXuLy))
                {
                    lichSuList = JsonConvert.DeserializeObject<List<LichSuXuLyItem>>(danhMuc.lichSuXuLy);
                }

                // Add new history item
                lichSuMoi.CreatedAt = DateTime.Now;
                lichSuList.Add(lichSuMoi);

                // Serialize and save
                danhMuc.lichSuXuLy = JsonConvert.SerializeObject(lichSuList);
                await _context.SaveChangesAsync();

                return Ok(danhMuc);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("them-nhan-xet-hoi-dong")]
        public async Task<IActionResult> ThemNhanXetHoiDong([FromBody] NhanXetHoiDongRequest request)
        {
            var entity = await _context.DanhMucXetDuyetSinhVien
                .FirstOrDefaultAsync(x => x.IDDanhMuc == request.Id);

            if (entity == null)
            {
                return NotFound("Không tìm thấy bản ghi.");
            }

            // --- 1. Xử lý thêm nhận xét hội đồng ---
            // Parse dữ liệu cũ
            var jsonList = new List<object>();

            if (!string.IsNullOrWhiteSpace(entity.hoiDongDanhGia))
            {
                try
                {
                    jsonList = entity.hoiDongDanhGia != null
                        ? JsonConvert.DeserializeObject<List<object>>(entity.hoiDongDanhGia) ?? new List<object>()
                        : new List<object>();
                }
                catch
                {
                    jsonList = new List<object>();
                }
            }

            // Tạo item mới
            var newItem = new
            {
                fromHoiDong = request.FromHoiDong,
                commentForGroup = request.CommentForGroup,
                commentForHoiDong = request.CommentForHoiDong,
                phieuDanhGia = request.PhieuDanhGia,
                ketLuan = request.KetLuan
            };

            jsonList.Add(newItem);

            // Serialize lại
            entity.hoiDongDanhGia = JsonConvert.SerializeObject(jsonList);

            // --- 2. Cập nhật status trong danhSachHDXetDuyet ---
            if (!string.IsNullOrWhiteSpace(request.FromHoiDong))
            {
                var parts = request.FromHoiDong.Split("|~|");
                if (parts.Length == 2)
                {
                    var email = parts[1].Trim();

                    if (!string.IsNullOrWhiteSpace(entity.danhSachHDXetDuyet))
                    {
                        try
                        {
                            var danhSach = JsonConvert.DeserializeObject<List<Dictionary<string, object>>>(entity.danhSachHDXetDuyet)
                                ?? new List<Dictionary<string, object>>();

                            foreach (var hd in danhSach)
                            {
                                if (hd.TryGetValue("email", out var e) && e?.ToString() == email)
                                {
                                    hd["status"] = "1"; // cập nhật trạng thái
                                }
                            }

                            entity.danhSachHDXetDuyet = JsonConvert.SerializeObject(danhSach);
                        }
                        catch
                        {
                            // Nếu lỗi parse, bỏ qua phần cập nhật này để tránh lỗi API
                        }
                    }
                }
            }

            await _context.SaveChangesAsync();

            return Ok();
        }

        [HttpGet("nhan-xet-hoi-dong/{id}")]
        public async Task<IActionResult> GetNhanXetHoiDong(int id)
        {
            var entity = await _context.DanhMucXetDuyetSinhVien
                .FirstOrDefaultAsync(x => x.IDDanhMuc == id);

            if (entity == null)
            {
                return NotFound("Không tìm thấy bản ghi.");
            }

            // Nếu null => trả về mảng rỗng dạng chuỗi
            var jsonString = string.IsNullOrWhiteSpace(entity.hoiDongDanhGia)
                ? "[]"
                : entity.hoiDongDanhGia;

            // trả về Content thay vì JSON object để frontend tự parse
            return Content(jsonString, "application/json");
        }

        [HttpPost("them-nhan-xet-hoi-dong-nghiem-thu")]
        public async Task<IActionResult> ThemNhanXetHoiDongNghiemThu([FromBody] NhanXetHoiDongNghiemThuRequest request)
        {
            var entity = await _context.DanhMucXetDuyetSinhVien
                .FirstOrDefaultAsync(x => x.IDDanhMuc == request.Id);

            if (entity == null)
            {
                return NotFound("Không tìm thấy bản ghi.");
            }

            // --- 1. Xử lý thêm nhận xét hội đồng ---
            // Parse dữ liệu cũ
            var jsonList = new List<object>();

            if (!string.IsNullOrWhiteSpace(entity.hoiDongDanhGia))
            {
                try
                {
                    jsonList = entity.hoiDongDanhGia != null
                        ? JsonConvert.DeserializeObject<List<object>>(entity.hoiDongDanhGia) ?? new List<object>()
                        : new List<object>();
                }
                catch
                {
                    jsonList = new List<object>();
                }
            }

            // Tạo item mới
            var newItem = new
            {
                fromHoiDongNghiemThu = request.FromHoiDongNghiemThu,
                commentForGroup = request.CommentForGroup,
                commentForHoiDong = request.CommentForHoiDong,
                phieuDanhGia = request.PhieuDanhGia,
                ketLuan = request.KetLuan
            };

            jsonList.Add(newItem);

            // Serialize lại
            entity.hoiDongDanhGia = JsonConvert.SerializeObject(jsonList);

            // --- 2. Cập nhật status trong danhSachHDNghiemThu ---
            if (!string.IsNullOrWhiteSpace(request.FromHoiDongNghiemThu))
            {
                var parts = request.FromHoiDongNghiemThu.Split("|~|");
                if (parts.Length == 2)
                {
                    var email = parts[1].Trim();

                    if (!string.IsNullOrWhiteSpace(entity.danhSachHDNghiemThu))
                    {
                        try
                        {
                            var danhSach = JsonConvert.DeserializeObject<List<Dictionary<string, object>>>(entity.danhSachHDNghiemThu)
                                ?? new List<Dictionary<string, object>>();

                            foreach (var hd in danhSach)
                            {
                                if (hd.TryGetValue("email", out var e) && e?.ToString() == email)
                                {
                                    hd["status"] = "1"; // cập nhật trạng thái
                                }
                            }

                            entity.danhSachHDNghiemThu = JsonConvert.SerializeObject(danhSach);
                        }
                        catch
                        {
                            // Nếu lỗi parse, bỏ qua phần cập nhật này để tránh lỗi API
                        }
                    }
                }
            }

            await _context.SaveChangesAsync();

            return Ok();
        }

        [HttpGet("nhan-xet-hoi-dong-nghiem-thu/{id}")]
        public async Task<IActionResult> GetNhanXetHoiDongNghiemThu(int id)
        {
            var entity = await _context.DanhMucXetDuyetSinhVien
                .FirstOrDefaultAsync(x => x.IDDanhMuc == id);

            if (entity == null)
            {
                return NotFound("Không tìm thấy bản ghi.");
            }

            // Nếu null => trả về mảng rỗng dạng chuỗi
            var jsonString = string.IsNullOrWhiteSpace(entity.hoiDongDanhGia)
                ? "[]"
                : entity.hoiDongDanhGia;

            // trả về Content thay vì JSON object để frontend tự parse
            return Content(jsonString, "application/json");
        }
    }
}