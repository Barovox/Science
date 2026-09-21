using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QLKHCN_API.Data;
using QLKHCN_API.Data.HelpExport;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Xceed.Document.NET;
using Xceed.Words.NET;

namespace QLKHCN_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class LyLichController : ControllerBase
    {
        private readonly MyDbContext _context;
        private readonly IWebHostEnvironment _hostingEnvironment;

        public LyLichController(MyDbContext context, IWebHostEnvironment hostingEnvironment)
        {
            _context = context;
            _hostingEnvironment = hostingEnvironment;
        }

        [HttpPut]
        [Route("Update/info/{IDUser}")]

        public async Task<IActionResult> Update(string IDUser, [FromBody] NguoiDung nguoiDung)
        {
            try
            {

                if (IDUser != nguoiDung.IDUser)
                {
                    return NotFound();
                }
                _context.Entry(nguoiDung).State = EntityState.Modified;
                await _context.SaveChangesAsync();
                return Ok(nguoiDung);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }



        [HttpGet]
        [Route("GetID")]
        public async Task<ActionResult<LyLich>> GetID(string id)
        {
            try
            {
                var result = await _context.LyLich.Where(a => a.IDLyLich.ToUpper().Equals(id.ToUpper())).FirstOrDefaultAsync();
                if (result != null)
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
        [Route("Get-all")]
        public async Task<ActionResult<IEnumerable<LyLich>>> GetAll()
        {
            try
            {
                var result = await _context.LyLich.ToListAsync();
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

        private List<LyLichData> GetLyLichData(String QuaTrinhDaoTao, int col)
        {
            var list = new List<LyLichData>();
            if (QuaTrinhDaoTao != null)
            {
                string[][] qtdt = HelpExport.regexSplit(QuaTrinhDaoTao, col);
                foreach (string[] parts in qtdt)
                {
                    list.Add(new LyLichData(parts.ToList()));
                }
            }
            return list;
        }




        //LyLichController (API) cập nhật GetLyLichData
        [HttpGet]
        [Route("Get-LyLichData")]
        public async Task<ActionResult<ListLyLichDataItem>> GetLyLichData(string id, string type)
        {
            try
            {

                // Code lấy dữ liệu và xử lý
                var list = new List<LyLichData>();
                var lylich = await _context.LyLich.ToListAsync();
                var result = lylich.Where(p => p.IDLyLich.ToUpper() == id.ToUpper()).FirstOrDefault();
                if (result == null)
                {
                    _context.LyLich.Add(
                        new LyLich()
                        {
                            IDLyLich = id
                        }
                    );
                    _context.SaveChanges();
                }
                result = lylich.Where(p => p.IDLyLich.ToUpper() == id.ToUpper()).FirstOrDefault();

                if (result != null)
                {
                    string QuaTrinhDaoTao = ""; int col = 0;
                    switch (type)
                    {
                        case "QTDT": QuaTrinhDaoTao = result.QuaTrinhDaoTao; col = 4; break;
                        case "CTCB": QuaTrinhDaoTao = result.CongTrinhCongBo; col = 5; break;
                        case "QTCT": QuaTrinhDaoTao = result.QuaTrinhCongTac; col = 4; break;
                        case "CTHTG": QuaTrinhDaoTao = result.ChuTriHoacThamGia; col = 4; break;
                        case "GT": QuaTrinhDaoTao = result.GiaiThuong; col = 3; break;
                        case "SCT": QuaTrinhDaoTao = result.SoCongTrinh; col = 4; break;
                        case "SLVB": QuaTrinhDaoTao = result.SoLuongVanBang; col = 3; break;
                        case "TT": QuaTrinhDaoTao = result.ThanhTuu; col = 3; break;
                    }
                    list = GetLyLichData(QuaTrinhDaoTao, col);

                    List<LyLichDataItem> dataList = list.Select(item => new LyLichDataItem
                    {
                        data = item.data
                    }).ToList();
                    ListLyLichDataItem listLyLichDataItem = new ListLyLichDataItem
                    {
                        col = col,
                        data = new List<LyLichDataItem>()
                    };
                    listLyLichDataItem.data.AddRange(dataList);
                    return listLyLichDataItem;
                }

                return NotFound();

            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut]
        [Route("Update/LyLich/")]
        public async Task<IActionResult> UpdateLL(string IDUser, [FromBody] LyLich lyLich)
        {
            try
            {
                if (IDUser != lyLich.IDLyLich)
                {
                    return NotFound();
                }

                // Tìm lyLich hiện tại trong cơ sở dữ liệu
                var existingLyLich = await _context.LyLich.FindAsync(IDUser);

                if (existingLyLich == null)
                {
                    return NotFound();
                }

                // Cập nhật các trường trong lyLich mà bạn muốn thay đổi
                existingLyLich.IDLyLich = lyLich.IDLyLich;
                existingLyLich.QuaTrinhDaoTao = lyLich.QuaTrinhDaoTao;
                existingLyLich.QuaTrinhCongTac = lyLich.QuaTrinhCongTac;
                existingLyLich.CongTrinhCongBo = lyLich.CongTrinhCongBo;
                existingLyLich.SoLuongVanBang = lyLich.SoLuongVanBang;
                existingLyLich.SoCongTrinh = lyLich.SoCongTrinh;
                existingLyLich.ChuTriHoacThamGia = lyLich.ChuTriHoacThamGia;
                existingLyLich.GiaiThuong = lyLich.GiaiThuong;
                existingLyLich.ThanhTuu = lyLich.ThanhTuu;

                await _context.SaveChangesAsync();

                return Ok(existingLyLich);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        [Route("Word")]
        public async Task<IActionResult> ExportToWord(String id)
        {
            var templateFileInfo = new FileInfo(Path.Combine(_hostingEnvironment.ContentRootPath, "Template", "template_NCKH_.docx"));
            var doc = DocX.Load(templateFileInfo.FullName);

            var nguoidung = await _context.NguoiDung.FindAsync(id);
            var lylich = await _context.LyLich.FindAsync(id);

            if (nguoidung == null) return NotFound();
            doc.Bookmarks["Name"]?.SetText(nguoidung.HoTen);

            Formatting formatting = new Formatting()
            {
                Bold = true,
                Italic = true,
                FontFamily = new Font("Times New Roman"),
                Size = 13
            };
            doc.Bookmarks["Name2"]?.SetText(nguoidung.HoTen, formatting);
            doc.Bookmarks["Sex2"]?.SetText(nguoidung.GioiTinh == "1" ? "Ông" : "Bà");

            doc.Bookmarks["Sex"]?.SetText(nguoidung.SDTDD);
            doc.Bookmarks["Birth"]?.SetText(nguoidung.NgaySinh.Value.ToShortDateString());
            doc.Bookmarks["Email"]?.SetText(nguoidung.EmailChinh);
            doc.Bookmarks["PhoneCQ"]?.SetText(nguoidung.SDTCoQuan);
            doc.Bookmarks["Phone"]?.SetText(nguoidung.SDTDD);
            doc.Bookmarks["ChucVu"]?.SetText(nguoidung.ChucVu);
            doc.Bookmarks["HocHam"]?.SetText(nguoidung.ChucVu);
            doc.Bookmarks["ChucDanh"]?.SetText(nguoidung.ChucDanh);
            doc.Bookmarks["DiaChi"]?.SetText(nguoidung.DiaChi);
            try
            {
                HelpExport.DataToTable(doc.Tables[1], HelpExport.regexSplit(lylich.QuaTrinhDaoTao, 4));
            }
            catch (Exception) { }
            try
            {
                HelpExport.DataToTable(doc.Tables[2], HelpExport.regexSplit(lylich.QuaTrinhCongTac, 4));
            }
            catch (Exception) { }
            try
            {
                HelpExport.DataToTable(doc.Tables[3], HelpExport.regexSplit(lylich.CongTrinhCongBo, 5));
            }
            catch (Exception) { }
            try
            {
                HelpExport.DataToTable(doc.Tables[4], HelpExport.regexSplit(lylich.SoLuongVanBang, 3));
            }
            catch (Exception) { }
            try
            {
                HelpExport.DataToTable(doc.Tables[5], HelpExport.regexSplit(lylich.SoCongTrinh, 4));
            }
            catch (Exception) { }
            try
            {
                HelpExport.DataToTable(doc.Tables[6], HelpExport.regexSplit(lylich.ChuTriHoacThamGia, 4));
            }
            catch (Exception) { }
            try
            {
                HelpExport.DataToTable(doc.Tables[7], HelpExport.regexSplit(lylich.GiaiThuong, 3));
            }
            catch (Exception) { }
            try
            {
                HelpExport.DataToTable(doc.Tables[8], HelpExport.regexSplit(lylich.ThanhTuu, 3));
            }
            catch (Exception) { }
            var stream = new MemoryStream();
            doc.SaveAs(stream);
            stream.Position = 0;

            return new FileStreamResult(stream, "application/vnd.openxmlformats-officedocument.wordprocessingml.document")
            {
                FileDownloadName = "user-" + nguoidung.HoTen + "-info.docx"
            };
        }
    }
}
