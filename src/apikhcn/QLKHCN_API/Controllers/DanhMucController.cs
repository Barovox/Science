using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OfficeOpenXml;
using QLKHCN_API.Data;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace QLKHCN_API.Controllers
{
    /// <summary>
    /// This API class <b>will be deprecated</b> in the near future. Please use the API from <see cref="DanhMucWOSController"/> instead.
    /// </summary>
    [Route("api/[controller]/")]
    [ApiController]
    [Authorize]
    public class DanhMucController : ControllerBase
    {
        private readonly MyDbContext _context;

        public DanhMucController(MyDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        [Route("Get-issn")]
        public async Task<ActionResult<IEnumerable<DanhMuc>>> Get_issn(string issn)
        {
            try
            {
                var result = await _context.DanhMuc
                                .Where(a => a.issn == issn &&
                                 ((!a.category_1.Contains("N/A") && a.category_1 != null) ||
                                  (!a.category_2.Contains("N/A") && a.category_2 != null) ||
                                  (!a.category_3.Contains("N/A") && a.category_3 != null) ||
                                  (!a.category_4.Contains("N/A") && a.category_4 != null) ||
                                  (!a.category_5.Contains("N/A") && a.category_5 != null) ||
                                  (!a.category_6.Contains("N/A") && a.category_6 != null)))
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
        [Route("Get-eissn")]
        public async Task<ActionResult<IEnumerable<DanhMuc>>> Get_eissn(string eissn)
        {
            try
            {
                var result = await _context.DanhMuc
                                .Where(a => a.eissn == eissn &&
                                 ((!a.category_1.Contains("N/A") && a.category_1 != null) ||
                                  (!a.category_2.Contains("N/A") && a.category_2 != null) ||
                                  (!a.category_3.Contains("N/A") && a.category_3 != null) ||
                                  (!a.category_4.Contains("N/A") && a.category_4 != null) ||
                                  (!a.category_5.Contains("N/A") && a.category_5 != null) ||
                                  (!a.category_6.Contains("N/A") && a.category_6 != null)))
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
        [Route("Get-all")]
        public async Task<ActionResult<IEnumerable<DanhMuc>>> GetAll()
        {
            try
            {
                return Ok(await _context.DanhMuc.ToListAsync());
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        [Route("search")]
        public async Task<ActionResult<IEnumerable<DanhMuc>>> Search(string key)
        {
            try
            {
                var result = await _context.DanhMuc.Where(a => a.issn == key || a.eissn == key || a.journal_name.Contains(key)).ToListAsync();
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
        public async Task<ActionResult<DanhMuc>> Create(DanhMuc danhmuc)
        {
            _context.DanhMuc.Add(danhmuc);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                return Conflict();
            }
            return Ok(danhmuc);
        }


        [HttpGet]
        [Route("Excel")]
        public async Task<IActionResult> ExportToExcel()
        {
            var data = await _context.DanhMuc.ToListAsync();
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
            var list = new List<DanhMuc>();

            using (var package = new ExcelPackage(file.OpenReadStream()))
            {
                var worksheet = package.Workbook.Worksheets.FirstOrDefault();

                if (worksheet == null)
                {
                    return BadRequest("Invalid worksheet");
                }

                for (int i = worksheet.Dimension.Start.Row + 1; i <= worksheet.Dimension.End.Row; i++)
                {
                    var item = new DanhMuc
                    {
                        journal_name = worksheet.Cells[i, 1].Value?.ToString().Trim(),
                        issn = worksheet.Cells[i, 2].Value?.ToString().Trim(),
                        eissn = worksheet.Cells[i, 3].Value?.ToString().Trim(),
                        category_1 = worksheet.Cells[i, 4].Value?.ToString().Trim(),
                        category_2 = worksheet.Cells[i, 5].Value?.ToString().Trim(),
                        category_3 = worksheet.Cells[i, 6].Value?.ToString().Trim(),
                        category_4 = worksheet.Cells[i, 7].Value?.ToString().Trim(),
                    };

                    list.Add(item);
                }
            }
            _context.DanhMuc.AddRange(list);
            await _context.SaveChangesAsync();

            return Ok();
        }
    }
}