using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QLKHCN_API.Data;
using QLKHCN_API.Data.HelpThongKe;
using QLKHCN_API.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QLKHCN_API.Controllers
{
    [Route("api/[controller]/")]
    [ApiController]
    [Authorize]
    public class ThongKeController : ControllerBase
    {
        private readonly MyDbContext _context;

        public ThongKeController(MyDbContext context)
        {
            _context = context;
        }

        [Authorize(Roles = "Quyền cao nhất, Quyền duyệt 1, Quyền duyệt 2, Quyền duyệt 3")]
        [HttpGet]
        [Route("Get-DonViCongTac_ThongKe")]
        public async Task<ActionResult<ChartData>> DonViCongTacThongKe(string dtString)
        {
            try
            {
                DateTime timeStart = new DateTime(int.Parse(dtString), 9, 1);
                DateTime timeEnd = timeStart.AddYears(1);

                var result = await _context.DanhMucXetDuyet
                    .Where(x => (x.dateSubmit >= timeStart && x.dateSubmit < timeEnd))
                    .Join(
                        _context.NguoiDung,
                        dm => dm.userId,
                        nd => nd.IDUser,
                        (dm, nd) => new DMXDViewModel
                        {
                            IDDanhMuc = dm.IDDanhMuc,
                            userId = dm.userId,
                            groupUser = dm.groupUser,
                            quantity = dm.quantity,
                            total = dm.total,
                            HoTen = nd.HoTen,
                            DonViCongTac = nd.DonViCongTac
                        }
                    )
                    .ToListAsync();

                var chartData = new ChartData();
                chartData.Labels = result.Select(x => x.DonViCongTac).Distinct().ToList();
                chartData.Data = chartData.Labels.Select(label => result.Count(x => x.DonViCongTac == label)).ToList();
                return Ok(chartData);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [Authorize(Roles = "Quyền cao nhất, Quyền duyệt 1, Quyền duyệt 2, Quyền duyệt 3")]
        [HttpGet]
        [Route("Get-Total-BaiBao")]
        public async Task<ActionResult<int>> TotalBaiBaoThongKe(string quyen, string khoa, string dtString)
        {
            try
            {
                DateTime timeStart = new DateTime(int.Parse(dtString), 9, 1);
                DateTime timeEnd = timeStart.AddYears(1);

                if (quyen == "Quyền cao nhất")
                {
                    var totalBaiBao = await _context.DanhMucXetDuyet
                        .Where(x => (x.dateSubmit >= timeStart && x.dateSubmit < timeEnd))
                        .CountAsync();
                    return Ok(totalBaiBao);

                }
                else
                {
                    var totalBaiBao = await _context.DanhMucXetDuyet
                        .Where(k => k.jci.Contains(khoa))
                        .Where(x => (x.dateSubmit >= timeStart && x.dateSubmit < timeEnd))
                        .CountAsync();
                    return Ok(totalBaiBao);

                }
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }


        [Authorize(Roles = "Quyền cao nhất, Quyền duyệt 1, Quyền duyệt 2, Quyền duyệt 3")]
        [HttpGet]
        [Route("Get-UserID_ThongKe")]
        public async Task<ActionResult<ChartData>> UserIdThongKe(string dtString)
        {
            try
            {
                DateTime timeStart = new DateTime(int.Parse(dtString), 9, 1);
                DateTime timeEnd = timeStart.AddYears(1);

                var result = await _context.DanhMucXetDuyet
                .Where(x => (x.dateSubmit >= timeStart && x.dateSubmit < timeEnd))
                .Join(
                    _context.NguoiDung,
                    dm => dm.userId,
                    nd => nd.IDUser,
                    (dm, nd) => new DMXDViewModel
                    {
                        IDDanhMuc = dm.IDDanhMuc,
                        userId = dm.userId,
                        groupUser = dm.groupUser,
                        quantity = dm.quantity,
                        total = dm.total,
                        HoTen = nd.HoTen,
                        DonViCongTac = nd.DonViCongTac
                    }
                )
                .ToListAsync();

                var groupedData = result
                    .GroupBy(x => x.DonViCongTac)
                    .Select(g => new { DonViCongTac = g.Key, Count = g.Select(x => x.userId).Distinct().Count() })
                    .ToList();

                var chartData = new ChartData();
                chartData.Labels = groupedData.Select(x => x.DonViCongTac).ToList();
                chartData.Data = groupedData.Select(x => x.Count).ToList();
                return Ok(chartData);


            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [Authorize(Roles = "Quyền cao nhất, Quyền duyệt 1, Quyền duyệt 2, Quyền duyệt 3")]
        [HttpGet]
        [Route("Get-TotalUserID_ThongKe")]
        public async Task<ActionResult<int>> TotalUserIDThongKe(string quyen, string khoa, string dtString)
        {
            try
            {
                DateTime timeStart = new DateTime(int.Parse(dtString), 9, 1);
                DateTime timeEnd = timeStart.AddYears(1);

                if (quyen == "Quyền cao nhất")
                {
                    var result = await _context.DanhMucXetDuyet
                        .Where(x => (x.dateSubmit >= timeStart && x.dateSubmit < timeEnd))
                        .Join(
                            _context.NguoiDung,
                            dm => dm.userId,
                            nd => nd.IDUser,
                            (dm, nd) => new DMXDViewModel
                            {
                                IDDanhMuc = dm.IDDanhMuc,
                                userId = dm.userId,
                                groupUser = dm.groupUser,
                                quantity = dm.quantity,
                                total = dm.total,
                                HoTen = nd.HoTen,
                                DonViCongTac = nd.DonViCongTac,
                                jci = dm.jci
                            }
                        )
                        .ToListAsync();

                    var groupedData = result
                        .GroupBy(x => x.DonViCongTac)
                        .Select(g => new { DonViCongTac = g.Key, Count = g.Select(x => x.userId).Distinct().Count() })
                        .ToList();

                    // Tính tổng số lượng người dùng từ groupedData
                    int totalUsers = groupedData.Sum(x => x.Count);

                    return Ok(totalUsers);
                }
                else
                {
                    var result = await _context.DanhMucXetDuyet
                        .Where(x => (x.dateSubmit >= timeStart && x.dateSubmit < timeEnd))
                        .Join(
                            _context.NguoiDung,
                            dm => dm.userId,
                            nd => nd.IDUser,
                            (dm, nd) => new DMXDViewModel
                            {
                                IDDanhMuc = dm.IDDanhMuc,
                                userId = dm.userId,
                                groupUser = dm.groupUser,
                                quantity = dm.quantity,
                                total = dm.total,
                                HoTen = nd.HoTen,
                                DonViCongTac = nd.DonViCongTac,
                                jci = dm.jci
                            }
                        ).Where(k => k.jci.Contains(khoa))
                        .ToListAsync();

                    var groupedData = result
                        .GroupBy(x => x.DonViCongTac)
                        .Select(g => new { DonViCongTac = g.Key, Count = g.Select(x => x.userId).Distinct().Count() })
                        .ToList();

                    // Tính tổng số lượng người dùng từ groupedData
                    int totalUsers = groupedData.Sum(x => x.Count);

                    return Ok(totalUsers);
                }
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [Authorize(Roles = "Quyền cao nhất, Quyền duyệt 1, Quyền duyệt 2, Quyền duyệt 3")]
        [HttpGet]
        [Route("Get-ThongKe_TrangThai")]
        public async Task<ActionResult<List<StackedBarChartData>>> ThongKe_TrangThai(string quyen, string khoa, string dtString)
        {
            try
            {
                DateTime timeStart = new DateTime(int.Parse(dtString), 9, 1);
                DateTime timeEnd = timeStart.AddYears(1);

                if (quyen == "Quyền cao nhất")
                {
                    var result = await _context.DanhMucXetDuyet
                        .Where(x => (x.dateSubmit >= timeStart && x.dateSubmit < timeEnd))
                        .Join(
                            _context.NguoiDung,
                            dm => dm.userId,
                            nd => nd.IDUser,
                            (dm, nd) => new DMXDViewModel
                            {
                                IDDanhMuc = dm.IDDanhMuc,
                                userId = dm.userId,
                                groupUser = dm.groupUser,
                                quantity = dm.quantity,
                                status = dm.status,
                                total = dm.total,
                                HoTen = nd.HoTen,
                                DonViCongTac = nd.DonViCongTac
                            }
                        )
                        .Where(x => x.status == "Đang đợi duyệt" || x.status == "Hoàn Thành")
                        .ToListAsync();

                    var groupedData = result
                        .GroupBy(x => x.DonViCongTac)
                        .Select(g => new StackedBarChartData
                        {
                            DonViCongTac = g.Key,
                            HoanThanh = g.Count(x => x.status == "Hoàn Thành"),
                            DangDoiDuyet = g.Count(x => x.status == "Đang đợi duyệt")
                        })
                        .ToList();

                    return Ok(groupedData);
                }
                else
                {
                    var result = await _context.DanhMucXetDuyet
                        .Where(x => (x.dateSubmit >= timeStart && x.dateSubmit < timeEnd))
                        .Join(
                            _context.NguoiDung,
                            dm => dm.userId,
                            nd => nd.IDUser,
                            (dm, nd) => new DMXDViewModel
                            {
                                IDDanhMuc = dm.IDDanhMuc,
                                userId = dm.userId,
                                groupUser = dm.groupUser,
                                quantity = dm.quantity,
                                status = dm.status,
                                total = dm.total,
                                HoTen = nd.HoTen,
                                DonViCongTac = nd.DonViCongTac,
                                jci = dm.jci
                            }
                        )
                        .Where(k => k.jci.Contains(khoa))
                        .Where(x => x.status == "Đang đợi duyệt" || x.status == "Hoàn Thành")
                        .ToListAsync();

                    var groupedData = result
                        .GroupBy(x => x.DonViCongTac)
                        .Select(g => new StackedBarChartData
                        {
                            DonViCongTac = g.Key,
                            HoanThanh = g.Count(x => x.status == "Hoàn Thành"),
                            DangDoiDuyet = g.Count(x => x.status == "Đang đợi duyệt")
                        })
                        .ToList();

                    return Ok(groupedData);
                }
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [Authorize(Roles = "Quyền cao nhất, Quyền duyệt 1, Quyền duyệt 2, Quyền duyệt 3")]
        [HttpGet]
        [Route("Get-ThongKe_Theloai")]
        public async Task<ActionResult<List<StackedBarChartData>>> ThongKe_Theloai(string quyen, string khoa, string dtString)
        {
            if (quyen == "Quyền cao nhất")
            {
                try
                {
                    DateTime timeStart = new DateTime(int.Parse(dtString), 9, 1);
                    DateTime timeEnd = timeStart.AddYears(1);

                    var result = await _context.DanhMucXetDuyet
                        .Where(x => (x.dateSubmit >= timeStart && x.dateSubmit < timeEnd))
                        .Join(
                            _context.NguoiDung,
                            dm => dm.userId,
                            nd => nd.IDUser,
                            (dm, nd) => new DMXDViewModel
                            {
                                IDDanhMuc = dm.IDDanhMuc,
                                userId = dm.userId,
                                groupUser = dm.groupUser,
                                quantity = dm.quantity,
                                status = dm.status,
                                category = dm.category,
                                total = dm.total,
                                HoTen = nd.HoTen,
                                DonViCongTac = nd.DonViCongTac
                            }
                        )
                        .Where(x => x.category == "Seminar cấp Khoa, báo cáo chuyên đề cấp đơn vị"
                        || x.category == "Đề tài NCKH cấp Trường" || x.category == "Hướng dẫn đề tài NCKH SV được nghiệm thu" || x.category == "Hướng dẫn sinh viên viết báo cáo khoa học được đăng trên kỷ yếu Hội nghị NCKH sinh viên (tối đa 5 điểm/GV/năm học)" || x.category == "Hướng dẫn đề tài NCKH SV được chọn gửi dự thi cấp Bộ, cấp Thành phố" || x.category == "Sinh viên đạt giải khuyến khích")
                        .ToListAsync();

                    var groupedData = result
                        .GroupBy(x => x.DonViCongTac)
                        .Select(g => new StackedBarChartData
                        {
                            DonViCongTac = g.Key,
                            Seminar = g.Count(x => x.category == "Seminar cấp Khoa, báo cáo chuyên đề cấp đơn vị"),
                            HDSV = g.Count(x => x.category == "Hướng dẫn đề tài NCKH SV được nghiệm thu"),
                            SV_KK = g.Count(x => x.category == "Sinh viên đạt giải khuyến khích"),
                            HDSV_vietBCKH = g.Count(x => x.category == "Hướng dẫn sinh viên viết báo cáo khoa học được đăng trên kỷ yếu Hội nghị NCKH sinh viên (tối đa 5 điểm/GV/năm học)"),
                            NCKH_Truong = g.Count(x => x.category == "Đề tài NCKH cấp Trường"),
                            HDSV_BoTP = g.Count(x => x.category == "Hướng dẫn đề tài NCKH SV được chọn gửi dự thi cấp Bộ, cấp Thành phố")
                        })
                        .ToList();

                    return Ok(groupedData);
                }
                catch (Exception ex)
                {
                    return BadRequest(ex.Message);
                }
            }
            else
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
                                userId = dm.userId,
                                groupUser = dm.groupUser,
                                quantity = dm.quantity,
                                status = dm.status,
                                category = dm.category,
                                total = dm.total,
                                HoTen = nd.HoTen,
                                DonViCongTac = nd.DonViCongTac,
                                jci = dm.jci

                            }
                        )
                        .Where(x => x.jci.Substring(0, 6).Contains(khoa) && (x.category == "Seminar cấp Khoa, báo cáo chuyên đề cấp đơn vị"
                        || x.category == "Đề tài NCKH cấp Trường" || x.category == "Hướng dẫn đề tài NCKH SV được nghiệm thu" || x.category == "Hướng dẫn sinh viên viết báo cáo khoa học được đăng trên kỷ yếu Hội nghị NCKH sinh viên (tối đa 5 điểm/GV/năm học)" || x.category == "Hướng dẫn đề tài NCKH SV được chọn gửi dự thi cấp Bộ, cấp Thành phố" || x.category == "Sinh viên đạt giải khuyến khích")
                        ).ToListAsync();

                    var groupedData = result
                        .GroupBy(x => x.DonViCongTac)
                        .Select(g => new StackedBarChartData
                        {
                            DonViCongTac = g.Key,
                            Seminar = g.Count(x => x.category == "Seminar cấp Khoa, báo cáo chuyên đề cấp đơn vị"),
                            HDSV = g.Count(x => x.category == "Hướng dẫn đề tài NCKH SV được nghiệm thu"),
                            SV_KK = g.Count(x => x.category == "Sinh viên đạt giải khuyến khích"),
                            HDSV_vietBCKH = g.Count(x => x.category == "Hướng dẫn sinh viên viết báo cáo khoa học được đăng trên kỷ yếu Hội nghị NCKH sinh viên (tối đa 5 điểm/GV/năm học)"),
                            NCKH_Truong = g.Count(x => x.category == "Đề tài NCKH cấp Trường"),
                            HDSV_BoTP = g.Count(x => x.category == "Hướng dẫn đề tài NCKH SV được chọn gửi dự thi cấp Bộ, cấp Thành phố")
                        })
                        .ToList();

                    return Ok(groupedData);
                }
                catch (Exception ex)
                {
                    return BadRequest(ex.Message);
                }
            }
        }

        [HttpGet]
        [Route("search")]
        public async Task<ActionResult<IEnumerable<DanhMucXetDuyet>>> Search(string key, string dtString)
        {
            try
            {
                DateTime timeStart = new DateTime(int.Parse(dtString), 9, 1);
                DateTime timeEnd = timeStart.AddYears(1);

                var result = await _context.DanhMucXetDuyet
                    .Where(x => (x.dateSubmit >= timeStart && x.dateSubmit < timeEnd))
                    .Where(a => a.userId == key || a.issn == key || a.eissn == key)
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
    }
}
