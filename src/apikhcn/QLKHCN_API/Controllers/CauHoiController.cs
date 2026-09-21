using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QLKHCN_API.Data;
using System.Collections.Generic;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace QLKHCN_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class CauHoiController : ControllerBase
    {
        private readonly MyDbContext _context;

        public CauHoiController(MyDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        [Route("Send")]
        public async Task<ActionResult<CauHoi>> PostCauHoi(CauHoi cauHoi)
        {
            var userIdClaim = User.FindFirst("IDUser")?.Value;

            if (string.IsNullOrEmpty(userIdClaim))
            {
                return Unauthorized("User ID is missing or invalid.");
            }

            // Now userIdClaim contains the ID of the authenticated user
            var idUser = userIdClaim; // The extracted user ID

            bool isDescExist = await _context.CauHoi.Where(x => x.q_by == idUser).AnyAsync(x => x.MoTa == cauHoi.MoTa);
            if (isDescExist)
            {
                return BadRequest("Nội dung vấn đề này đã tồn tại.");
            }
            _context.CauHoi.Add(cauHoi);
            try
            {
                await _context.SaveChangesAsync();
                return Ok(cauHoi);
            }
            catch (DbUpdateException)
            {
                return Conflict();
            }
        }

        [Authorize(Roles = "Quyền cao nhất")]
        [HttpGet]
        [Route("Get-all")]
        public async Task<ActionResult<IEnumerable<CauHoi>>> GetAllCauHoi()
        {
            try
            {
                var result = await _context.CauHoi.ToListAsync();
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        [Route("Get-all-quest-ans")]
        public async Task<ActionResult<IEnumerable<CauHoi>>> GetAllCauHoiDaTraLoi()
        {
            try
            {
                var result = await _context.CauHoi
                            .Where(x => !string.IsNullOrEmpty(x.TieuDe) && !string.IsNullOrEmpty(x.TraLoi) && !string.IsNullOrEmpty(x.PhanLoai) && x.CongKhai == true)
                            .ToListAsync();
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        [Route("Get-FAQ")]
        public async Task<ActionResult<IEnumerable<CauHoi>>> GetFAQ()
        {
            try
            {
                var result = await _context.CauHoi
                            .Where(x => !string.IsNullOrEmpty(x.TieuDe) && !string.IsNullOrEmpty(x.TraLoi) && !string.IsNullOrEmpty(x.PhanLoai) && x.CongKhai == true && x.ThuongGap == true)
                            .ToListAsync();
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [Authorize(Roles = "Quyền cao nhất")]
        [HttpGet]
        [Route("Get-id/{IDCauHoi}")]
        public async Task<ActionResult<IEnumerable<CauHoi>>> GetCauHoiById(int IDCauHoi)
        {
            try
            {
                var cauHoi = await _context.CauHoi.FirstOrDefaultAsync(x => x.IDCauHoi == IDCauHoi);
                return Ok(cauHoi);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        [Route("Get-by-id-publish/{IDCauHoi}")]
        public async Task<ActionResult<IEnumerable<CauHoi>>> GetCauHoiCongKhaiById(int IDCauHoi)
        {
            try
            {
                var cauHoi = await _context.CauHoi
                                .Where(x => x.IDCauHoi == IDCauHoi && x.CongKhai == true)
                                .ToListAsync();
                return Ok(cauHoi);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        [Route("Get-all-by-user")]
        public async Task<ActionResult<IEnumerable<CauHoi>>> GetAllCauHoiByUser()
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
                var result = await _context.CauHoi
                            .Where(x => x.q_by == idUser)
                            .ToListAsync();
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        [Route("Get-id-by-user/{IDCauHoi}")]
        public async Task<ActionResult<IEnumerable<CauHoi>>> GetIdCauHoiByUser(int IDCauHoi)
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
                var cauHoi = await _context.CauHoi
                            .FirstOrDefaultAsync(x => x.IDCauHoi == IDCauHoi && x.q_by == idUser);

                if (cauHoi == null)
                {
                    return NotFound($"Question with ID {IDCauHoi} does not exist.");
                }

                if (cauHoi.q_by != idUser)
                {
                    return Forbid("You do not have permission to access this question.");
                }

                return Ok(cauHoi);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [Authorize(Roles = "Quyền cao nhất")]
        [HttpPut]
        [Route("Update/{IDCauHoi}")]
        public async Task<IActionResult> Update(int IDCauHoi, CauHoi cauHoi)
        {
            if (IDCauHoi != cauHoi.IDCauHoi)
            {
                return BadRequest();
            }

            try
            {
                var cauHoiTemp = await _context.CauHoi.FirstOrDefaultAsync(a => a.IDCauHoi == IDCauHoi);
                cauHoiTemp.TieuDe = cauHoi.TieuDe;
                cauHoiTemp.TraLoi = cauHoi.TraLoi;
                cauHoiTemp.PhanLoai = cauHoi.PhanLoai;
                cauHoiTemp.CongKhai = cauHoi.CongKhai;
                cauHoiTemp.ThuongGap = cauHoi.ThuongGap;
                cauHoiTemp.a_by = cauHoi.a_by;
                cauHoiTemp.a_dateSubmit = cauHoi.a_dateSubmit;

                _context.Entry(cauHoiTemp).State = EntityState.Modified;
                await _context.SaveChangesAsync();
                return Ok(cauHoiTemp);
            }
            catch (DbUpdateConcurrencyException)
            {
                return NotFound();
            }
        }

        [Authorize(Roles = "Quyền cao nhất")]
        [HttpDelete]
        [Route("Delete/{IDCauHoi}")]
        public async Task<IActionResult> Delete(int IDCauHoi)
        {
            try
            {
                var cauHoi = await _context.CauHoi
                            .FirstOrDefaultAsync(x => x.IDCauHoi == IDCauHoi);

                if (cauHoi == null)
                {
                    return NotFound($"Question with ID {IDCauHoi} does not exist.");
                }

                _context.CauHoi.Remove(cauHoi);
                await _context.SaveChangesAsync();

                return NoContent();
            }
            catch (DbUpdateConcurrencyException)
            {
                return NotFound();
            }
        }
    }
}
