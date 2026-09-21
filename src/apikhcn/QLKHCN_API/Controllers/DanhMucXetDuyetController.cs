using EllipticCurve.Utils;
using ExcelDataReader;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OfficeOpenXml.Table.PivotTable;
using PdfSharpCore.Pdf.Content.Objects;
using QLKHCN_API.Data;
using QLKHCN_API.Data.HelpExport;
using QLKHCN_API.ViewModels;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.IO.Compression;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using System.Web;
namespace QLKHCN_API.Controllers
{
    [Route("api/[controller]/")]
    [ApiController]
    [Authorize]
    public class DanhMucXetDuyetController : ControllerBase
    {
        private readonly IWebHostEnvironment _hostingEnvironment;
        private readonly MyDbContext _context;

        public DanhMucXetDuyetController(MyDbContext context, IWebHostEnvironment hostingEnvironment)
        {
            _hostingEnvironment = hostingEnvironment;
            _context = context;
        }

        [Authorize(Roles = "Quyền cao nhất, Quyền duyệt 1, Quyền duyệt 2, Quyền duyệt 3")]
        [HttpGet]
        [Route("Get-all-datatem")]
        public async Task<ActionResult<IEnumerable<DanhMucXetDuyet>>> GetAllDataTem()
        {
            try
            {
                var result = await _context.DanhMucXetDuyet
                    .Join(
                        _context.NguoiDung,
                        dm => dm.userId,
                        nd => nd.IDUser,
                        (dm, nd) => new DMXDViewModel
                        {
                            IDDanhMuc = dm.IDDanhMuc,
                            journal_name = dm.journal_name,
                            issn = dm.issn,
                            eissn = dm.eissn,
                            category = dm.category,
                            citations = dm.citations,
                            if_2022 = dm.if_2022,
                            percentageOAGold = dm.percentageOAGold,
                            userId = dm.userId,
                            tenBaiBao = dm.tenBaiBao,
                            groupUser = dm.groupUser,
                            rank = dm.rank,
                            link = dm.link,
                            status = dm.status,
                            quantity = dm.quantity,
                            image = dm.image,
                            imageTenBB = dm.imageTenBB,
                            total = dm.total,
                            HoTen = nd.HoTen,
                            DonViCongTac = nd.DonViCongTac
                        }
                    )
                    .ToListAsync();

                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [Authorize(Roles = "Quyền cao nhất, Quyền duyệt 1, Quyền duyệt 2, Quyền duyệt 3")]
        [HttpGet]
        [Route("Get-all")]
        public async Task<ActionResult<IEnumerable<DMXDViewModel>>> GetAllByQuyen(string quyen, string startTimes)
        {
            try
            {
                // get năm học theo cài đặt hệ thống
                var dateRange = GetDateRangeFromNamHoc(startTimes);
                // get loại xuất công trình
                string xuat = GetXuatDMXD();
                
                var statusKeywords = GetStatusKeywords(quyen);

                if (xuat == "dateSubmit")
                {
                    var result = await _context.DanhMucXetDuyet
                            .Where(a => statusKeywords.Contains(a.status))
                            .Where(b => b.dateSubmit >= dateRange[0] && b.dateSubmit <= dateRange[1])
                            .ToListAsync();
                    return Ok(result);
                }
                else if (xuat == "dateSubmit_now")
                {
                    var result = await _context.DanhMucXetDuyet
                            .Where(a => statusKeywords.Contains(a.status))
                            .Where(b => b.dateSubmit_now >= dateRange[0] && b.dateSubmit_now <= dateRange[1])
                            .ToListAsync();
                    return Ok(result);
                }
                else
                {
                    return Ok(new List<DanhMucXetDuyet>());
                }
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
                    return new List<string> { "Đang đợi duyệt", "Từ chối" };

                case "Quyền duyệt 2":
                    return new List<string> { "Duyệt lần 1", "Từ chối" };

                case "Quyền duyệt 3":
                    return new List<string> { "Duyệt lần 2", "Hoàn thành", "Từ chối" };

                case "Quyền cao nhất":
                    return new List<string> { "Đang đợi duyệt", "Duyệt lần 1", "Duyệt lần 2", "Duyệt lần 3", "Hoàn thành", "Từ chối" };

                default:
                    return new List<string>();
            }
        }

        [HttpGet]
        [Route("Get-id")]
        public async Task<ActionResult<DanhMucXetDuyet>> GetId(int IDDanhMuc)
        {
            var result = await _context.DanhMucXetDuyet.FindAsync(IDDanhMuc);

            if (result == null)
            {
                return NotFound();
            }

            return result;
        }

        [Authorize(Roles = "Quyền cao nhất, Quyền duyệt 1, Quyền duyệt 2, Quyền duyệt 3")]
        [HttpGet]
        [Route("Get-data")]
        public async Task<ActionResult<IEnumerable<DanhMucXetDuyet>>> GetSelect(string status)
        {
            try
            {
                var result = await _context.DanhMucXetDuyet.Where(a => a.status.Contains(status))
                    .Join(
                        _context.NguoiDung,
                        dm => dm.userId,
                        nd => nd.IDUser,
                        (dm, nd) => new DanhMucXetDuyet
                        {
                            IDDanhMuc = dm.IDDanhMuc,
                            journal_name = dm.journal_name,
                            issn = dm.issn,
                            eissn = dm.eissn,
                            category = dm.category,
                            citations = dm.citations,
                            if_2022 = dm.if_2022,
                            percentageOAGold = dm.percentageOAGold,
                            userId = nd.HoTen,
                            tenBaiBao = dm.tenBaiBao,
                            groupUser = dm.groupUser,
                            rank = dm.rank,
                            link = dm.link,
                            status = dm.status,
                            quantity = dm.quantity,
                            total = dm.total
                        }
                    )
                    .ToListAsync();
                if (result.Count > 0)
                {
                    return result;
                }
                return NotFound();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        [Route("Get-by-userid")]
        public async Task<ActionResult<IEnumerable<DanhMucXetDuyet>>> GetByUserId(string userid, string startTimes)
        {
            try
            {
                // get năm học theo cài đặt hệ thống
                var dateRange = GetDateRangeFromNamHoc(startTimes);
                // get loại xuất công trình
                string xuat = GetXuatDMXD();

                if (xuat == "dateSubmit")
                {
                    var result = await _context.DanhMucXetDuyet
                        .Where(a => a.groupUser.Contains(userid))
                        .Where(c => c.dateSubmit_now != null)
                        .Where(b => b.dateSubmit >= dateRange[0] && b.dateSubmit <= dateRange[1])
                        .ToListAsync();
                    return Ok(result);
                }
                else if (xuat == "dateSubmit_now")
                {
                    var result = await _context.DanhMucXetDuyet
                        .Where(a => a.groupUser.Contains(userid))
                        .Where(c => c.dateSubmit_now != null)
                        .Where(b => b.dateSubmit_now >= dateRange[0] && b.dateSubmit <= dateRange[1])
                        .ToListAsync();
                    return Ok(result);
                }
                else
                {
                    return Ok(new List<DanhMucXetDuyet>());
                }
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        [Route("Get-by-groupuser")]
        public async Task<ActionResult<IEnumerable<DanhMucXetDuyet>>> GetByGroupUser(string groupuser)
        {
            var result = await _context.DanhMucXetDuyet.Where(a => a.userId.Contains(groupuser)).ToListAsync();
            try
            {
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        [Route("Get-by-tenbaibao")]
        public async Task<ActionResult<IEnumerable<DanhMucXetDuyet>>> GetByTenBaiBao(string tenbaibao)
        {
            var result = await _context.DanhMucXetDuyet.Where(a => a.tenBaiBao.Contains(tenbaibao)).ToListAsync();
            try
            {
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("GetNguoiDungByDanhMucXetDuyet")]
        public async Task<ActionResult<IEnumerable<NguoiDung>>> GetNguoiDungByDanhMucXetDuyet()
        {
            var result = await _context.DanhMucXetDuyet
                .Join(
                    _context.NguoiDung,
                    dm => dm.userId,
                    nd => nd.IDUser,
                    (dm, nd) => new NguoiDung { IDUser = dm.userId, HoTen = nd.HoTen }
                )
                .ToListAsync();
            return Ok(result);
        }

        // TODO
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
                var danhmucxetduyet = await _context.DanhMucXetDuyet.FirstOrDefaultAsync(a => a.IDDanhMuc == idDanhMuc);
                if (danhmucxetduyet == null)
                {
                    return NotFound();
                }
                danhmucxetduyet.status = status;
                if (status == "Duyệt lần 1")
                {
                    danhmucxetduyet.review1 = idUser;
                } else if (status == "Duyệt lần 2")
                {
                    danhmucxetduyet.review2 = idUser;
                } else if (status == "Từ chối")
                {
                    danhmucxetduyet.rejectBy = idUser;
                    danhmucxetduyet.completedBy = "";
                } else if (status == "Hoàn Thành")
                {
                    danhmucxetduyet.completedBy = idUser;
                    danhmucxetduyet.rejectBy = "";
                }

                _context.Entry(danhmucxetduyet).State = EntityState.Modified;
                await _context.SaveChangesAsync();
                return Ok(danhmucxetduyet);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [Authorize(Roles = "Quyền cao nhất, Quyền duyệt 1, Quyền duyệt 2, Quyền duyệt 3")]
        [HttpPut]
        [Route("Update-ghichu/{idDanhMuc}")]
        public async Task<IActionResult> GhiChu(int idDanhMuc, [FromBody] string ghichu)
        {
            try
            {
                var danhmucxetduyet = await _context.DanhMucXetDuyet.FirstOrDefaultAsync(a => a.IDDanhMuc == idDanhMuc);
                if (danhmucxetduyet == null)
                {
                    return NotFound();
                }
                danhmucxetduyet.ghiChu = ghichu;
                _context.Entry(danhmucxetduyet).State = EntityState.Modified;
                await _context.SaveChangesAsync();
                return Ok(danhmucxetduyet);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [Authorize(Roles = "Quyền cao nhất, Quyền duyệt 1, Quyền duyệt 2, Quyền duyệt 3")]
        [HttpPut]
        [Route("Update-dateSubmit/{idDanhMuc}")]
        public async Task<IActionResult> UpdateDateSubmit(int idDanhMuc, [FromBody] DanhMucXetDuyet dmxd)
        {
            try
            {
                var danhmucxetduyet = await _context.DanhMucXetDuyet.FirstOrDefaultAsync(a => a.IDDanhMuc == idDanhMuc);
                if (danhmucxetduyet == null)
                {
                    return NotFound();
                }
                danhmucxetduyet.dateSubmit = dmxd.dateSubmit;
                danhmucxetduyet.dateSubmit_now = dmxd.dateSubmit_now;
                _context.Entry(danhmucxetduyet).State = EntityState.Modified;
                await _context.SaveChangesAsync();
                return Ok(danhmucxetduyet);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        /*[HttpGet]
        [Route("Excel")]
        public async Task<IActionResult> ExportToExcel()
        {
            var cList = _context.DanhMucXetDuyet.ToList();
            string timestamp = DateTime.Now.ToString("dd-MM-yyyy HH:mm:ss", CultureInfo.InvariantCulture).ToUpper().Replace(':', '_').Replace('.', '_').Replace(' ', '_').Trim();
            var templateFileInfo = new FileInfo(Path.Combine(_hostingEnvironment.ContentRootPath, "Template", "Template.xlsx"));
            var stream = HelpExport.UpdateDataIntoExcelTemplate(cList, templateFileInfo);
            return new FileStreamResult(stream, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
            {
                FileDownloadName = "data.xlsx"
            };
        }*/
        [HttpGet("Download_minhchung")]
        public async Task<IActionResult> DownloadImages(string dvct)
        {
            List<string> linkList = null;
            if (dvct != null)
            {
                linkList = await _context.DanhMucXetDuyet
                    .Where(dv => dv.jci.Contains(dvct))
                    .Select(a => a.image)
                    .ToListAsync();
            }
            using (var memoryStream = new MemoryStream())
            {
                using (var zipArchive = new ZipArchive(memoryStream, ZipArchiveMode.Create, true))
                {
                    foreach (var imageUrl in linkList)
                    {
                        using (var client = new WebClient())
                        {
                            try
                            {
                                byte[] imageBytes = client.DownloadData("https://khcn.uef.edu.vn" + imageUrl);
                                string fileName = Path.GetFileName("https://khcn.uef.edu.vn" + imageUrl);
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

        [HttpGet]
        [Route("ExcelUserid")]
        public async Task<IActionResult> ExportToExcelDeTaiUser(string userid, int xuat, DateTime startTime)
        {
            DateTime targetDate = DateTime.Parse("2022-07-01 00:00:00.0000000");

            List<DanhMucXetDuyet> cList;
            if (startTime == targetDate)
            {
                cList = await _context.DanhMucXetDuyet
                                      .Where(a => a.groupUser.Contains(userid) &&
                                                  a.status == "Hoàn thành" &&
                                                  !a.dateSubmit_now.HasValue)
                                      .ToListAsync();
            }
            else
            {
                cList = await _context.DanhMucXetDuyet
                                      .Where(a => a.groupUser.Contains(userid) &&
                                                  a.status == "Hoàn thành" &&
                                                  a.dateSubmit_now.HasValue &&
                                                  a.dateSubmit_now.Value.Date >= startTime.Date &&
                                                  a.dateSubmit_now.Value.Date <= startTime.AddYears(1).Date)
                                      .ToListAsync();
            }

            var user = await _context.NguoiDung.FindAsync(userid);
            var excelDataList = new List<ExeclDmxdUserVm>();

            foreach (var item in cList)
            {
                decimal total = decimal.Parse(item.total);
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
                    total = item.total,
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

        [HttpGet]
        [Route("GetAll-DonViCongTac")]
        public async Task<ActionResult<List<string>>> GetAllDonViCongTac()
        {
            try
            {
                var result = await _context.NguoiDung.Select(a => a.DonViCongTac).Distinct().ToListAsync();
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [Authorize(Roles = "Quyền cao nhất, Quyền duyệt 1, Quyền duyệt 2, Quyền duyệt 3")]
        [HttpGet]
        [Route("Get-all-articles-by-donvicongtac")]
        public async Task<ActionResult<IEnumerable<DanhMucXetDuyet>>> GetAllArticlesByDonViCongTac(string donViCongTac)
        {
            try
            {
                var result = await _context.DanhMucXetDuyet
                    .Join(
                        _context.NguoiDung,
                        dm => dm.userId,
                        nd => nd.IDUser,
                        (dm, nd) => new DMXDViewModel
                        {
                            IDDanhMuc = dm.IDDanhMuc,
                            journal_name = dm.journal_name,
                            issn = dm.issn,
                            eissn = dm.eissn,
                            category = dm.category,
                            citations = dm.citations,
                            if_2022 = dm.if_2022,
                            percentageOAGold = dm.percentageOAGold,
                            userId = dm.userId,
                            tenBaiBao = dm.tenBaiBao,
                            groupUser = dm.groupUser,
                            rank = dm.rank,
                            link = dm.link,
                            status = dm.status,
                            quantity = dm.quantity,
                            image = dm.image,
                            imageTenBB = dm.imageTenBB,
                            total = dm.total,
                            HoTen = nd.HoTen,
                            DonViCongTac = nd.DonViCongTac

                        }
                    )
                    .Where(dm => dm.DonViCongTac == donViCongTac && dm.status == "Hoàn thành")

                    .ToListAsync();

                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        //Demo HDNCKH
        //[Authorize(Roles = "Quyền cao nhất, Quyền duyệt 1, Quyền duyệt 2, Quyền duyệt 3")]
        [HttpGet]
        [Route("ExportToExcelHDNCKH")]
        public async Task<IActionResult> ExportToExcelHDNCKH(int xuat, string donViCongTac)
        {
            var danhMucXetDuyetList = await _context.DanhMucXetDuyet
                .Join(
                    _context.NguoiDung,
                    dm => dm.userId,
                    nd => nd.IDUser,
                    (dm, nd) => new DMXDViewModel
                    {
                        IDDanhMuc = dm.IDDanhMuc,
                        journal_name = dm.journal_name,
                        issn = dm.issn,
                        eissn = dm.eissn,
                        category = dm.category,
                        citations = dm.citations,
                        if_2022 = dm.if_2022,
                        percentageOAGold = dm.percentageOAGold,
                        userId = dm.userId,
                        tenBaiBao = dm.tenBaiBao,
                        groupUser = dm.groupUser,
                        rank = dm.rank,
                        link = dm.link,
                        status = dm.status,
                        quantity = dm.quantity,
                        image = dm.image,
                        imageTenBB = dm.imageTenBB,
                        total = dm.total,
                        HoTen = nd.HoTen,
                        DonViCongTac = nd.DonViCongTac,
                        loaiCongTrinh = dm.loaiCongTrinh
                    }
                )
                .Where(dm => dm.DonViCongTac.Contains(donViCongTac) && dm.status == "Hoàn thành" && dm.loaiCongTrinh == "HDNCKH")
                .ToListAsync();

            var excelDataList = new List<ExeclDmxdUserVm>();

            foreach (var item in danhMucXetDuyetList)
            {
                decimal total = decimal.Parse(item.total);
                decimal thue = total * 0.1m;
                decimal thunhap = total - thue;

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
                        total = item.total,
                        thue = thue.ToString(),
                        thunhap = thunhap.ToString()
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
        // TODO
        [Authorize(Roles = "Quyền cao nhất, Quyền duyệt 1, Quyền duyệt 2, Quyền duyệt 3")]
        [HttpGet]
        [Route("ExportToExcelDVCT")]
        public async Task<IActionResult> ExportToExcelDVCT(int xuat, string donViCongTac, string startTime)
        {
            // get năm học theo cài đặt hệ thống
            var dateRange = GetDateRangeFromNamHoc(startTime);
            // get loại xuất công trình
            string xuatType = GetXuatDMXD();

            List<DMXDViewModel> danhMucXetDuyetList;

            if (xuatType == "dateSubmit")
            {
                danhMucXetDuyetList = await _context.DanhMucXetDuyet
                .Join(
                    _context.NguoiDung,
                    dm => dm.userId,
                    nd => nd.IDUser,
                    (dm, nd) => new { dm, nd })
                .Where(x => x.dm.jci.Contains(donViCongTac)
                         && x.dm.status == "Hoàn thành"
                         && x.dm.dateSubmit >= dateRange[0] && x.dm.dateSubmit <= dateRange[1]
                         && x.dm.dateSubmit_now != null)
                .Select(x => new DMXDViewModel
                    {
                        IDDanhMuc = x.dm.IDDanhMuc,
                        journal_name = x.dm.journal_name,
                        issn = x.dm.issn,
                        eissn = x.dm.eissn,
                        category = x.dm.category,
                        citations = x.dm.citations,
                        if_2022 = x.dm.if_2022,
                        percentageOAGold = x.dm.percentageOAGold,
                        userId = x.dm.userId,
                        tenBaiBao = x.dm.tenBaiBao,
                        groupUser = x.dm.groupUser,
                        rank = x.dm.rank,
                        link = x.dm.link,
                        status = x.dm.status,
                        quantity = x.dm.quantity,
                        image = x.dm.image,
                        imageTenBB = x.dm.imageTenBB,
                        fileList = x.dm.fileList,
                        total = x.dm.total,
                        HoTen = x.nd.HoTen,
                        DonViCongTac = x.nd.DonViCongTac,
                        jci = x.dm.jci,
                        dateSubmit = x.dm.dateSubmit
                    })
                .ToListAsync();
            }
            else if (xuatType == "dateSubmit_now")
            {
                danhMucXetDuyetList = await _context.DanhMucXetDuyet
                .Join(
                    _context.NguoiDung,
                    dm => dm.userId,
                    nd => nd.IDUser,
                    (dm, nd) => new { dm, nd })
                .Where(x => x.dm.jci.Contains(donViCongTac)
                         && x.dm.status == "Hoàn thành"
                         && x.dm.dateSubmit_now >= dateRange[0] && x.dm.dateSubmit_now <= dateRange[1]
                         && x.dm.dateSubmit_now != null)
                .Select(x => new DMXDViewModel
                    {
                        IDDanhMuc = x.dm.IDDanhMuc,
                        journal_name = x.dm.journal_name,
                        issn = x.dm.issn,
                        eissn = x.dm.eissn,
                        category = x.dm.category,
                        citations = x.dm.citations,
                        if_2022 = x.dm.if_2022,
                        percentageOAGold = x.dm.percentageOAGold,
                        userId = x.dm.userId,
                        tenBaiBao = x.dm.tenBaiBao,
                        groupUser = x.dm.groupUser,
                        rank = x.dm.rank,
                        link = x.dm.link,
                        status = x.dm.status,
                        quantity = x.dm.quantity,
                        image = x.dm.image,
                        imageTenBB = x.dm.imageTenBB,
                        fileList = x.dm.fileList,
                        total = x.dm.total,
                        HoTen = x.nd.HoTen,
                        DonViCongTac = x.nd.DonViCongTac,
                        jci = x.dm.jci,
                        dateSubmit = x.dm.dateSubmit
                })
                .ToListAsync();
            }
            else
            {
                return Ok(new List<DMXDViewModel>());
            }

            var excelDataList = new List<ExeclDmxdUserVm>();

            foreach (var item in danhMucXetDuyetList)
            {
                decimal total = decimal.Parse(item.total);
                decimal thue = total * 0.1m;
                decimal thunhap = total - thue;

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
                        image = item.image,
                        fileList = item.fileList,
                        diem = tacGia.diem,
                        total = item.total,
                        thue = thue.ToString(),
                        thunhap = thunhap.ToString(),
                        jci = item.jci,
                        dateSubmit = item.dateSubmit
                    };

                    excelDataList.Add(temp);
                    //break; // temp
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




        [Authorize(Roles = "Quyền cao nhất")]
        [HttpPost("/api/UploadExcelFile"), DisableRequestSizeLimit]
        public async Task<IActionResult> UploadExcel(IFormFile formFile)

        {
            try
            {
                Encoding.RegisterProvider(CodePagesEncodingProvider.Instance);
                var list = new List<DanhMucXetDuyet>();
                using (var stream = new MemoryStream())
                {
                    await formFile.CopyToAsync(stream);
                    var reader = ExcelReaderFactory.CreateReader(stream);
                    var result = reader.AsDataSet(new ExcelDataSetConfiguration
                    {
                        ConfigureDataTable = _ => new ExcelDataTableConfiguration
                        {
                            UseHeaderRow = true
                        }
                    });
                    var table = result.Tables[0];
                    for (int i = 1; i < table.Rows.Count; i++)
                    {
                        var row = table.Rows[i];
                        if (row.ItemArray.All(x => string.IsNullOrEmpty(x?.ToString().Trim())))
                        {
                            continue;
                        }
                        var item = new DanhMucXetDuyet
                        {
                            journal_name = row[0] == DBNull.Value ? null : row[0].ToString(),
                            issn = row[1] == DBNull.Value ? null : row[1].ToString(),
                            eissn = row[2] == DBNull.Value ? null : row[2].ToString(),
                            category = row[3] == DBNull.Value ? null : row[3].ToString(),
                            citations = row[4] == DBNull.Value ? null : row[4].ToString(),
                            if_2022 = row[5] == DBNull.Value ? null : row[5].ToString(),
                            jci = row[6] == DBNull.Value ? null : row[6].ToString(),
                            percentageOAGold = row[7] == DBNull.Value ? null : row[7].ToString(),
                            userId = row[8] == DBNull.Value ? null : row[8].ToString(),
                            rank = row[9] == DBNull.Value ? null : row[9].ToString(),
                            image = row[10] == DBNull.Value ? null : row[10].ToString(),
                            link = row[11] == DBNull.Value ? null : row[11].ToString(),
                            tenBaiBao = row[12] == DBNull.Value ? null : row[12].ToString(),
                            groupUser = row[13] == DBNull.Value ? null : row[13].ToString(),
                            status = row[14].ToString()
                        };
                        list.Add(item);
                    }
                }
                foreach (var item in list)
                {
                    _context.DanhMucXetDuyet.Add(item);
                }
                _context.SaveChanges();
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [Authorize(Roles = "Quyền cao nhất, Quyền duyệt 1, Quyền duyệt 2, Quyền duyệt 3")]
        [HttpPut("changeGroupuser/{idDanhMuc}")]
        public async Task<IActionResult> changeGroupuser(int idDanhMuc, [FromBody] string status)
        {
            try
            {
                var danhmucxetduyet = await _context.DanhMucXetDuyet.FirstOrDefaultAsync(a => a.IDDanhMuc == idDanhMuc);
                if (danhmucxetduyet == null)
                {
                    return NotFound();
                }
                danhmucxetduyet.groupUser = status;
                _context.Entry(danhmucxetduyet).State = EntityState.Modified;
                await _context.SaveChangesAsync();
                return Ok(danhmucxetduyet);
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
            var result = await _context.DanhMucXetDuyet.FindAsync(IDDanhMuc);
            if (result == null)
            {
                return NotFound();
            }
            else if (result.status != "Đang đợi duyệt")
            {
                return BadRequest("Không xóa được lúc này");
            }

            _context.DanhMucXetDuyet.Remove(result);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        /*[Authorize(Roles = "Quyền cao nhất, Quyền duyệt 1, Quyền duyệt 2, Quyền duyệt 3")]*/

        [HttpPut]
        [Route("Update/{IDDanhMuc}")]
        public async Task<IActionResult> Update(int IDDanhMuc, DanhMucXetDuyet dmxd)
        {
            if (IDDanhMuc != dmxd.IDDanhMuc)
            {
                return BadRequest();
            }
            _context.Entry(dmxd).State = EntityState.Modified;

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

        [HttpPost]
        [Route("Send")]
        public async Task<ActionResult<DanhMucXetDuyet>> PostChiTietChungNhan(DanhMucXetDuyet danhMucXetDuyet)
        {
            bool isNameExist = await _context.DanhMucXetDuyet.AnyAsync(x => x.tenBaiBao == danhMucXetDuyet.tenBaiBao);
            if (isNameExist)
            {
                return BadRequest("Tên đã tồn tại.");
            }
            _context.DanhMucXetDuyet.Add(danhMucXetDuyet);
            try
            {
                await _context.SaveChangesAsync();
                return Ok(danhMucXetDuyet);
            }
            catch (DbUpdateException)
            {
                return Conflict();
            }
        }

        private DateTime[] GetDateRangeFromNamHoc(string year)
        {
            var namHoc = _context.CaiDatHeThong.FirstOrDefault(x => x.id == "NamHoc");
            if (namHoc != null && !string.IsNullOrEmpty(namHoc.value))
            {
                // convert this JSON string to get object: {"dateStart":"15","monthStart":"10","dateEnd":"14","monthEnd":"10"}
                var json = Newtonsoft.Json.JsonConvert.DeserializeObject<dynamic>(namHoc.value);

                DateTime dateStart = new DateTime(int.Parse(year), int.Parse(json.monthStart.ToString()), int.Parse(json.dateStart.ToString()));
                DateTime dateEnd = new DateTime(int.Parse(year) + 1, int.Parse(json.monthEnd.ToString()), int.Parse(json.dateEnd.ToString()));
                return new DateTime[] { dateStart, dateEnd };
            }
            return null;
        }

        private string GetXuatDMXD()
        {
            var xuatDMXD = _context.CaiDatHeThong.FirstOrDefault(x => x.id == "XuatDMXD");
            if (xuatDMXD != null && !string.IsNullOrEmpty(xuatDMXD.value))
            {
                return xuatDMXD.value;
            }
            return "0"; // Default value if not found
        }

        /*[HttpPost]
        [Route("SendMail")]
        public async Task<ActionResult<string>> SendMail(string textContent, string textSubject)
        {
            var mailList = _context.NguoiDung.Select(nd => nd.EmailChinh).Where(nd => nd.Contains("@")).ToList();
            foreach(var mail in mailList)
            {
                string apiKey = "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";
                string senderEmail = "ngluan161121@gmail.com";
                string recipientEmail = mail.ToString();
                string subject = textSubject;
                string content = textContent;
                var client = new SendGridClient(apiKey);
                var from = new EmailAddress(senderEmail);
                var to = new EmailAddress(recipientEmail);
                var message = MailHelper.CreateSingleEmail(from, to, subject, content, content);
                try
                {
                    var response = await client.SendEmailAsync(message);
                    return Ok("Email sent successfully. Status code: " + response.StatusCode);

                }
                catch (Exception ex)
                {
                    return BadRequest("An error occurred while sending the email: " + ex.Message);
                }
            }
            return Ok();


        }*/
    }
}