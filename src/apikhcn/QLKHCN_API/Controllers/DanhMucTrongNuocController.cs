using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;
using System;
using QLKHCN_API.Data;
using System.Linq;
using Microsoft.AspNetCore.Authorization;
using OfficeOpenXml;
using System.IO;

namespace QLKHCN_API.Controllers
{
    /// <summary>
    /// This API class <b>will be deprecated</b> in the near future. Please use the API from <see cref="DanhMucHDGSNNController"/> instead.
    /// </summary>
    [Route("api/[controller]/")]
    [ApiController]
    [Authorize]
    public class DanhMucTrongNuocController : ControllerBase
    {
        private readonly MyDbContext _context;

        public DanhMucTrongNuocController(MyDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        [Route("Get-DanhMucTrongNuoc")]
        public async Task<ActionResult<IEnumerable<DanhMucTrongNuoc>>> Get_issn_DMTN(string issn)
        {
            try
            {
                var result = await _context.DanhMucTrongNuoc.Where(a => a.CHISOISSN.Contains(issn)).ToListAsync();
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
        public async Task<ActionResult<IEnumerable<DanhMucTrongNuoc>>> GetAll()
        {
            try
            {
                return Ok(await _context.DanhMucTrongNuoc.ToListAsync());
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        [Route("search")]
        public async Task<ActionResult<IEnumerable<DanhMucTrongNuoc>>> Search(string key)
        {
            try
            {
                var result = await _context.DanhMucTrongNuoc.Where(a => a.CHISOISSN == key || a.HOIDONGNGANH == key || a.TENTAPCHI.Contains(key)).ToListAsync();
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
        public async Task<ActionResult<DanhMucTrongNuoc>> Create(DanhMucTrongNuoc dmtn)
        {
            _context.DanhMucTrongNuoc.Add(dmtn);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                return Conflict();
            }
            return Ok(dmtn);
        }


        [HttpGet] 
        [Route("Excel")]
        public async Task<IActionResult> ExportToExcel()
        {
            var data = await _context.DanhMucTrongNuoc.ToListAsync();
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
            var list = new List<DanhMucTrongNuoc>();

            using (var package = new ExcelPackage(file.OpenReadStream()))
            {
                var worksheet = package.Workbook.Worksheets.FirstOrDefault();

                if (worksheet == null)
                {
                    return BadRequest("Invalid worksheet");
                }

                for (int i = worksheet.Dimension.Start.Row + 1; i <= worksheet.Dimension.End.Row; i++)
                {
                    var item = new DanhMucTrongNuoc
                    {
                        STT = worksheet.Cells[i, 1].Value?.ToString().Trim(),
                        HOIDONGNGANH = worksheet.Cells[i, 2].Value?.ToString().Trim(),
                        TENTAPCHI = worksheet.Cells[i, 3].Value?.ToString().Trim(),
                        CHISOISSN = worksheet.Cells[i, 4].Value?.ToString().Trim(),
                        LOAI = worksheet.Cells[i, 5].Value?.ToString().Trim(),
                        COQUANXUATBAN = worksheet.Cells[i, 6].Value?.ToString().Trim(),
                        DIEM = worksheet.Cells[i, 7].Value?.ToString().Trim(),
                    };

                    list.Add(item);
                }
            }
            _context.DanhMucTrongNuoc.AddRange(list);
            await _context.SaveChangesAsync();

            return Ok();
        }
    }
}