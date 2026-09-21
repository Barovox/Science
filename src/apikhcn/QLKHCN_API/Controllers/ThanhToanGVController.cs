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
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TheArtOfDev.HtmlRenderer.PdfSharp;
using Microsoft.AspNetCore.Authorization;

namespace QLKHCN_API.Controllers
{
    [Route("api/[controller]/")]
    [ApiController]
    [Authorize]
    public class ThanhToanGVController : ControllerBase
    {
        private readonly MyDbContext _context;

        public ThanhToanGVController(MyDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        [Route("Get-all")]
        public async Task<ActionResult<IEnumerable<ThanhToanGV>>> GetAll()
        {
            try
            {
                var result = await _context.ThanhToanGV.ToListAsync();
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
        [Route("Get-id")]
        public async Task<ActionResult<ThanhToanGV>> GetId(int id)
        {
            var result = await _context.ThanhToanGV.FindAsync(id);

            if (result == null)
            {
                return NotFound();
            }

            return result;
        }

        [HttpGet]
        [Route("Get-LSP")]
        public async Task<ActionResult<IEnumerable<ThanhToanGV>>> Get_LSP(string lsp)
        {
            try
            {
                var result = await _context.ThanhToanGV.Where(a => a.LoaiSanPham == lsp).ToListAsync();
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

        [Authorize(Roles = "Quyền cao nhất")]
        [HttpPost]
        [Route("Create")]
        public async Task<ActionResult<ThanhToanGV>> Create(ThanhToanGV ttgv)
        {
            _context.ThanhToanGV.Add(ttgv);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                return Conflict();
            }
            return Ok(ttgv);
        }

        [Authorize(Roles = "Quyền cao nhất")]
        [HttpPut]
        [Route("Update/{id}")]
        public async Task<IActionResult> Update(int id, ThanhToanGV thanhtoanGV)
        {
            if (id != thanhtoanGV.ID)
            {
                return BadRequest();
            }

            _context.Entry(thanhtoanGV).State = EntityState.Modified;

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
        [Route("Delete/{id}")]
        public async Task<ActionResult<IEnumerable<ThanhToanGV>>> Delete(int id)
        {
            try
            {
                var result = await _context.ThanhToanGV.FindAsync(id);
                if (result != null)
                {
                    _context.ThanhToanGV.Remove(result);
                    await _context.SaveChangesAsync();
                    return NoContent();
                }
                return NotFound();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        [Route("Excel")]
        public async Task<IActionResult> ExportToExcel()
        {
            var data = await _context.ThanhToanGV.ToListAsync();
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
            var list = new List<ThanhToanGV>();

            using (var package = new ExcelPackage(file.OpenReadStream()))
            {
                var worksheet = package.Workbook.Worksheets.FirstOrDefault();

                if (worksheet == null)
                {
                    return BadRequest("Invalid worksheet");
                }

                for (int i = worksheet.Dimension.Start.Row + 1; i <= worksheet.Dimension.End.Row; i++)
                {
                    var item = new ThanhToanGV
                    {
                        LoaiSanPham = worksheet.Cells[i, 1].Value?.ToString().Trim(),
                        MoTaLoaiSanPham = worksheet.Cells[i, 2].Value?.ToString().Trim(),
                        YeuCauChatLuong = worksheet.Cells[i, 3].Value?.ToString().Trim(),
                        KinhPhi = worksheet.Cells[i, 4].Value?.ToString().Trim()
                    };

                    list.Add(item);
                }
            }
            _context.ThanhToanGV.AddRange(list);
            await _context.SaveChangesAsync();

            return Ok();
        }

        [HttpGet]
        [Route("Pdf")]
        public async Task<IActionResult> ExportPdf2()
        {
            var document = new PdfDocument();
            var data = await _context.ThanhToanGV.ToListAsync();
            var html = new StringBuilder();
            html.Append("<table>");
            html.Append("<tr><th>ID</th><th>Loại sản phẩm</th><th>Mô tả loại sản phẩm</th><th>Yêu cầu chất lượng</th><th>Kinh phí</th></tr>");
            foreach (var item in data)
            {
                html.AppendFormat("<tr><td>{0}</td><td>{1}</td><td>{2}</td><td>{3}</td><td>{4}</td></tr>",
                item.ID, item.LoaiSanPham, item.MoTaLoaiSanPham, item.YeuCauChatLuong, item.KinhPhi);
            }
            html.Append("</table>");

            PdfGenerator.AddPdfPages(document, html.ToString(), PageSize.A4);
            byte[]? reponse = null;
            using (MemoryStream ms = new MemoryStream())
            {
                document.Save(ms);
                reponse = ms.ToArray();
            }
            return File(reponse, "application/pdf", "data.pdf");
        }
    }
}