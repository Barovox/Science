using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OfficeOpenXml;
using PdfSharpCore.Pdf;
using PdfSharpCore;
using QLKHCN_API.Data;
using System;
using System.Collections.Generic;
using System.IO;
using System.Text;
using System.Threading.Tasks;
using TheArtOfDev.HtmlRenderer.PdfSharp;
using System.Linq;
using Microsoft.AspNetCore.Authorization;

namespace QLKHCN_API.Controllers
{
    [Route("api/[controller]/")]
    [ApiController]
    [Authorize]
    public class QuyDoiNCVController : ControllerBase
    {
        private readonly MyDbContext _context;

        public QuyDoiNCVController(MyDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        [Route("Get-all")]
        public async Task<ActionResult<IEnumerable<QuyDoiNCV>>> Get_All_QuyDoiNCV()
        {
            try
            {
                return Ok(await _context.QuyDoiNCV.ToListAsync());
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        [Route("Get-id")]
        public async Task<ActionResult<QuyDoiNCV>> GetId(int ID)
        {
            var result = await _context.QuyDoiNCV.FindAsync(ID);

            if (result == null)
            {
                return NotFound();
            }

            return result;
        }

        [Authorize(Roles = "Quyền cao nhất")]
        [HttpPost]
        [Route("Create")]
        public async Task<ActionResult<QuyDoiNCV>> Create(QuyDoiNCV qdgv)
        {
            _context.QuyDoiNCV.Add(qdgv);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                return Conflict();
            }
            return Ok(qdgv);
        }

        [Authorize(Roles = "Quyền cao nhất")]
        [HttpPut]
        [Route("Update/{ID}")]
        public async Task<IActionResult> Update(int ID, QuyDoiNCV qdgv)
        {
            if (ID != qdgv.ID)
            {
                return BadRequest();
            }

            _context.Entry(qdgv).State = EntityState.Modified;

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

        [Authorize(Roles = "Quyền cao nhất")]
        [HttpDelete]
        [Route("Delete/{ID}")]
        public async Task<IActionResult> Delete(int ID)
        {
            var result = await _context.QuyDoiNCV.FindAsync(ID);
            if (result == null)
            {
                return NotFound();
            }

            _context.QuyDoiNCV.Remove(result);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpGet]
        [Route("Excel")]
        public async Task<IActionResult> ExportToExcel()
        {
            var data = await _context.QuyDoiNCV.ToListAsync();
            using (var package = new ExcelPackage())
            {
                var worksheet = package.Workbook.Worksheets.Add("Sheet1");
                worksheet.Cells.LoadFromCollection(data, true);

                var stream = new MemoryStream(package.GetAsByteArray());
                return new FileStreamResult(stream, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
                {
                    FileDownloadName = "data.xlsx"
                };
            }
        }

        [Authorize(Roles = "Quyền cao nhất")]
        [HttpPost]
        [Route("ImportExcel")]
        public async Task<IActionResult> ImportExcel(IFormFile file)
        {
            var list = new List<QuyDoiNCV>();

            using (var package = new ExcelPackage(file.OpenReadStream()))
            {
                var worksheet = package.Workbook.Worksheets.FirstOrDefault();

                if (worksheet == null)
                {
                    return BadRequest("Invalid worksheet");
                }

                for (int i = worksheet.Dimension.Start.Row + 1; i <= worksheet.Dimension.End.Row; i++)
                {
                    var item = new QuyDoiNCV
                    {
                        LoaiSanPham = worksheet.Cells[i, 1].Value?.ToString().Trim(),
                        MoTaLoaiSanPham = worksheet.Cells[i, 2].Value?.ToString().Trim(),
                        YeuCauTieuChuan = worksheet.Cells[i, 3].Value?.ToString().Trim(),
                        TietChuan = worksheet.Cells[i, 4].Value?.ToString().Trim(),
                        Diem = worksheet.Cells[i, 5].Value?.ToString().Trim()
                    };

                    list.Add(item);
                }
            }
            _context.QuyDoiNCV.AddRange(list);
            await _context.SaveChangesAsync();

            return Ok();
        }

        [HttpGet]
        [Route("Pdf")]
        public async Task<IActionResult> ExportPdf()
        {
            var document = new PdfDocument();
            var data = await _context.QuyDoiNCV.ToListAsync();
            var html = new StringBuilder();
            html.Append("<table>");
            html.Append("<tr><th>ID</th><th>Loại sản phẩm</th><th>Mô tả loại sản phẩm</th><th>Yêu cầu tiêu chuẩn</th><th>Tiết chuẩn</th><th>Điểm</th></tr>");
            foreach (var item in data)
            {
                html.AppendFormat("<tr><td>{0}</td><td>{1}</td><td>{2}</td><td>{3}</td><td>{4}</td><td>{5}</td></tr>",
                item.ID, item.LoaiSanPham, item.MoTaLoaiSanPham, item.YeuCauTieuChuan, item.TietChuan, item.Diem);
            }
            html.Append("</table>");

            PdfGenerator.AddPdfPages(document, html.ToString(), PageSize.A4);
            byte[]? reponse = null;
            using (MemoryStream ms = new MemoryStream())
            {
                document.Save(ms);
                reponse = ms.ToArray();
            }
            return File(reponse, "application/pdf", "QuyDoiNCV.pdf");
        }

        [HttpGet]
        [Route("Get-spkhcn")]
        public async Task<ActionResult<IEnumerable<QuyDoiNCV>>> Get_By_SPKHCN(string spkhcn)
        {
            try
            {
                var result = await _context.QuyDoiNCV.Where(a => a.LoaiSanPham == spkhcn).ToListAsync();
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
    }
}