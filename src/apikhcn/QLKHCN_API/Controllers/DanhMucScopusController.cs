using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using QLKHCN_API.Data;
using System.Collections.Generic;
using System.Threading.Tasks;
using System;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using OfficeOpenXml;
using System.IO;

namespace QLKHCN_API.Controllers
{
    [Route("api/[controller]/")]
    [ApiController]
    [Authorize]
    public class DanhMucScopusController : ControllerBase
    {
        private readonly MyDbContext _context;

        public DanhMucScopusController(MyDbContext context)
        {
            _context = context;
        }

        private async Task CheckAndCreateTable(int year)
        {
            var tableName = $"DanhMucScopus{year}";
            var createTableSql = $@"
                IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = '{tableName}')
                BEGIN
                    CREATE TABLE {tableName} (
                        [number] INT IDENTITY(1, 1),
                        [journal_name] NVARCHAR(MAX),
                        [issn] NVARCHAR(500),
                        [eissn] NVARCHAR(500),
                        [category_1] NVARCHAR(500),
                        [category_2] NVARCHAR(500),
                        [category_3] NVARCHAR(500),
                        [category_4] NVARCHAR(500),
                        [category_5] NVARCHAR(500),
                        [category_6] NVARCHAR(500),
                        [category_7] NVARCHAR(500),
                        [category_8] NVARCHAR(500),
                        [category_9] NVARCHAR(500),
                        [category_10] NVARCHAR(500),
                        [category_11] NVARCHAR(500),
                        [category_12] NVARCHAR(500)
                    );
                END";
            await _context.Database.ExecuteSqlRawAsync(createTableSql);
        }

        [HttpGet]
        [Route("{year}/Get-issn")]
        public async Task<ActionResult<IEnumerable<DanhMucScopus>>> Get_issn(string issn, int year)
        {
            try
            {
                var result = await _context.Set<DanhMucScopus>()
                            .FromSqlRaw($@"
                                SELECT * FROM DanhMucScopus{year}
                                WHERE issn = {{0}}
                                AND (
                                    (category_1 IS NOT NULL AND category_1 <> 'N/A') OR
                                    (category_2 IS NOT NULL AND category_2 <> 'N/A') OR
                                    (category_3 IS NOT NULL AND category_3 <> 'N/A') OR
                                    (category_4 IS NOT NULL AND category_4 <> 'N/A') OR
                                    (category_5 IS NOT NULL AND category_5 <> 'N/A') OR
                                    (category_6 IS NOT NULL AND category_6 <> 'N/A') OR
                                    (category_7 IS NOT NULL AND category_7 <> 'N/A') OR
                                    (category_8 IS NOT NULL AND category_8 <> 'N/A') OR
                                    (category_9 IS NOT NULL AND category_9 <> 'N/A') OR
                                    (category_10 IS NOT NULL AND category_10 <> 'N/A') OR
                                    (category_11 IS NOT NULL AND category_11 <> 'N/A') OR
                                    (category_12 IS NOT NULL AND category_12 <> 'N/A')
                                )
                            ", issn)
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
        [Route("{year}/Get-eissn")]
        public async Task<ActionResult<IEnumerable<DanhMucScopus>>> Get_eissn(string eissn, int year)
        {
            try
            {
                var result = await _context.Set<DanhMucScopus>()
                                .FromSqlRaw($@"
                                    SELECT * FROM DanhMucScopus{year}
                                    WHERE eissn = {{0}}
                                    AND (
                                        (category_1 IS NOT NULL AND category_1 <> 'N/A') OR
                                        (category_2 IS NOT NULL AND category_2 <> 'N/A') OR
                                        (category_3 IS NOT NULL AND category_3 <> 'N/A') OR
                                        (category_4 IS NOT NULL AND category_4 <> 'N/A') OR
                                        (category_5 IS NOT NULL AND category_5 <> 'N/A') OR
                                        (category_6 IS NOT NULL AND category_6 <> 'N/A') OR
                                        (category_7 IS NOT NULL AND category_7 <> 'N/A') OR
                                        (category_8 IS NOT NULL AND category_8 <> 'N/A') OR
                                        (category_9 IS NOT NULL AND category_9 <> 'N/A') OR
                                        (category_10 IS NOT NULL AND category_10 <> 'N/A') OR
                                        (category_11 IS NOT NULL AND category_11 <> 'N/A') OR
                                        (category_12 IS NOT NULL AND category_12 <> 'N/A')
                                    )
                                ", eissn)
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
        public async Task<ActionResult<IEnumerable<DanhMucScopus>>> GetAll(int year)
        {
            try
            {
                return Ok(await _context.Set<DanhMucScopus>()
                    .FromSqlRaw($"SELECT * FROM DanhMucScopus{year}")
                    .ToListAsync());
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        [Route("{year}/search")]
        public async Task<ActionResult<IEnumerable<DanhMucScopus>>> Search(string key, int year)
        {
            try
            {
                var result = await _context.Set<DanhMucScopus>()
                    .FromSqlRaw($"SELECT * FROM DanhMucScopus{year} WHERE issn = {{0}} OR eissn = {{0}} OR journal_name LIKE {{1}}", key, $"%{key}%")
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
        public async Task<ActionResult<DanhMucScopus>> Create(DanhMucScopus scimago, int year)
        {
            try
            {
                await CheckAndCreateTable(year);
                await _context.Database.ExecuteSqlRawAsync($@"
                    INSERT INTO DanhMucScopus{year} 
                    ([journal_name], [issn], [eissn], [category_1], [category_2], [category_3], [category_4], [category_5], [category_6], [category_7], [category_8], [category_9], [category_10], [category_11], [category_12]) 
                    VALUES ({{0}}, {{1}}, {{2}}, {{3}}, {{4}}, {{5}}, {{6}}, {{7}}, {{8}}, {{9}}, {{10}}, {{11}}, {{12}}, {{13}}, {{14}})",
                    scimago.journal_name, scimago.issn, scimago.eissn, scimago.category_1, scimago.category_2, scimago.category_3, scimago.category_4, scimago.category_5, scimago.category_6, scimago.category_7, scimago.category_8, scimago.category_9, scimago.category_10, scimago.category_11, scimago.category_12);
                return Ok(scimago);
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
                await _context.Database.ExecuteSqlRawAsync($@"DELETE FROM DanhMucScopus{year} WHERE [number] = {id}");
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
                var data = await _context.Set<DanhMucScopus>()
                            .FromSqlRaw($"SELECT * FROM DanhMucScopus{year}")
                            .ToListAsync();

                using (var package = new ExcelPackage())
                {
                    var worksheet = package.Workbook.Worksheets.Add($"DanhMucScopus{year}");
                    worksheet.Cells.LoadFromCollection(data, true);

                    var stream = new MemoryStream(package.GetAsByteArray());
                    return new FileStreamResult(stream, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
                    {
                        FileDownloadName = $"DanhMucScopus{year}.xlsx"
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

                var list = new List<DanhMucScopus>();

                using (var package = new ExcelPackage(file.OpenReadStream()))
                {
                    var worksheet = package.Workbook.Worksheets.FirstOrDefault();

                    if (worksheet == null)
                    {
                        return BadRequest("Invalid worksheet");
                    }

                    for (int i = worksheet.Dimension.Start.Row + 1; i <= worksheet.Dimension.End.Row; i++)
                    {
                        var item = new DanhMucScopus
                        {
                            journal_name = worksheet.Cells[i, 1].Value?.ToString().Trim(),
                            issn = worksheet.Cells[i, 2].Value?.ToString().Trim(),
                            eissn = worksheet.Cells[i, 3].Value?.ToString().Trim(),
                            category_1 = worksheet.Cells[i, 4].Value?.ToString().Trim(),
                            category_2 = worksheet.Cells[i, 5].Value?.ToString().Trim(),
                            category_3 = worksheet.Cells[i, 6].Value?.ToString().Trim(),
                            category_4 = worksheet.Cells[i, 7].Value?.ToString().Trim(),
                            category_5 = worksheet.Cells[i, 8].Value?.ToString().Trim(),
                            category_6 = worksheet.Cells[i, 9].Value?.ToString().Trim(),
                            category_7 = worksheet.Cells[i, 10].Value?.ToString().Trim(),
                            category_8 = worksheet.Cells[i, 11].Value?.ToString().Trim(),
                            category_9 = worksheet.Cells[i, 12].Value?.ToString().Trim(),
                            category_10 = worksheet.Cells[i, 13].Value?.ToString().Trim(),
                            category_11 = worksheet.Cells[i, 14].Value?.ToString().Trim(),
                            category_12 = worksheet.Cells[i, 15].Value?.ToString().Trim(),

                        };

                        list.Add(item);
                    }
                }

                foreach (var scimago in list)
                {
                    await _context.Database.ExecuteSqlRawAsync($@"
                        INSERT INTO DanhMucScopus{year} 
                        ([journal_name], [issn], [eissn], [category_1], [category_2], [category_3], [category_4], [category_5], [category_6], [category_7], [category_8], [category_9], [category_10], [category_11], [category_12]) 
                        VALUES ({{0}}, {{1}}, {{2}}, {{3}}, {{4}}, {{5}}, {{6}}, {{7}}, {{8}}, {{9}}, {{10}}, {{11}}, {{12}}, {{13}}, {{14}})",
                        scimago.journal_name, scimago.issn, scimago.eissn, scimago.category_1, scimago.category_2, scimago.category_3, scimago.category_4, scimago.category_5, scimago.category_6, scimago.category_7, scimago.category_8, scimago.category_9, scimago.category_10, scimago.category_11, scimago.category_12);
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

                var tableName = $"DanhMucScopus{year}";

                switch (request.mode)
                {
                    case "61483": // clear data
                        await _context.Database.ExecuteSqlRawAsync($@"
                            IF OBJECT_ID('{tableName}', 'U') IS NOT NULL
                            TRUNCATE TABLE {tableName}
                        ");
                        break;

                    case "73056": // delete data
                        await _context.Database.ExecuteSqlRawAsync($@"
                            IF OBJECT_ID('{tableName}', 'U') IS NOT NULL
                            DELETE FROM {tableName}
                        ");
                        break;

                    case "84592": // drop table
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