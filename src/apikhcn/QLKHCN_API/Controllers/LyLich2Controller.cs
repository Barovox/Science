using Microsoft.AspNetCore.Mvc;
using QLKHCN_API.Data;
using QLKHCN_API.ViewModels;
using System.Threading.Tasks;
using System;
using System.Linq;
using Microsoft.AspNetCore.Authorization;
using Newtonsoft.Json;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;

namespace QLKHCN_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class LyLich2Controller : ControllerBase
    {
        private readonly MyDbContext _context;

        public LyLich2Controller(MyDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        [Route("Get/info/{IDUser}")]
        public async Task<IActionResult> Get(string IDUser)
        {
            try
            {
                var lyLich = await _context.LyLich2.FindAsync(IDUser);
                if (lyLich == null)
                {
                    return NotFound(new { Message = "Không tìm thấy hồ sơ cá nhân. Vui lòng hoàn thiện các thông tin để tiếp tục." });
                }

                // Kiểm tra trường ThongTinChung có dữ liệu không
                var property = typeof(LyLich2).GetProperty("ThongTinChung");
                var value = (string) property.GetValue(lyLich);

                if (!string.IsNullOrEmpty(value))
                {
                    var jsonDoc = JsonDocument.Parse(value); // Chuyển đổi JSON string thành JSON document
                    var root = jsonDoc.RootElement;

                    List<string> nullProperty = new();

                    // Lấy các giá trị key
                    if (root.GetProperty("hoTen").GetString() == "") nullProperty.Add("Vui lòng thêm Họ tên");
                    if (root.GetProperty("gioiTinh").GetString() == "") nullProperty.Add("Vui lòng thêm Giới tính");
                    if (root.GetProperty("namSinh").GetString() == "") nullProperty.Add("Vui lòng thêm Năm sinh");
                    if (root.GetProperty("sdt").GetString() == "") nullProperty.Add("Vui lòng thêm Số điện thoại");
                    if (root.GetProperty("email").GetString() == "") nullProperty.Add("Vui lòng thêm Email");
                    if (root.GetProperty("donViCongTac").GetString() == "") nullProperty.Add("Vui lòng thêm Đơn vị công tác");
                    if (root.GetProperty("chucVu").GetString() == "") nullProperty.Add("Vui lòng thêm Chức vụ");

                    if (nullProperty.Count > 0)
                    {
                        return BadRequest(new { Message = "Vui lòng hoàn thiện thông tin", MissingFields = nullProperty });
                    }
                    else
                    {
                        return Ok();
                    }
                }
                else
                {
                    return BadRequest(new { Message = "Vui lòng hoàn thiện thông tin" });
                }
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut]
        [Route("Update/info/{IDUser}")]
        public async Task<IActionResult> Update(string IDUser, [FromBody] LyLich2 lyLich)
        {
            var userIdClaim = User.FindFirst("IDUser")?.Value;

            if (string.IsNullOrEmpty(userIdClaim))
            {
                return Unauthorized("User ID is missing or invalid.");
            }

            // Now userIdClaim contains the ID of the authenticated user
            var userID = userIdClaim; // The extracted user ID

            if (IDUser != userID || lyLich.IDLyLich != userID)
            {
                return BadRequest("Access denied");
            }

            try
            {
                // Tìm bản ghi hiện tại
                var existingLyLich = await _context.LyLich2.FindAsync(IDUser);

                // Nếu không tồn tại => tạo mới
                if (existingLyLich == null)
                {
                    existingLyLich = new LyLich2
                    {
                        IDLyLich = IDUser,
                    };
                    _context.LyLich2.Add(existingLyLich);
                }

                // Sử dụng Reflection để cập nhật các thuộc tính không null
                foreach (var property in typeof(LyLich2).GetProperties())
                {
                    var newValue = property.GetValue(lyLich);
                    if (newValue != null)
                    {
                        property.SetValue(existingLyLich, newValue);
                    }
                }

                // Lưu thay đổi vào db
                await _context.SaveChangesAsync();
                return Ok(existingLyLich);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        #nullable enable
        [HttpGet]
        [Route("GetField/{IDUser}/{fieldName?}")]
        public async Task<IActionResult> GetField(string IDUser, string? fieldName = null)
        {
            try
            {
                // Tìm bản ghi theo IDUser
                var lyLich = await _context.LyLich2.FindAsync(IDUser);
                if (lyLich == null)
                {
                    return NotFound($"No record found with IDUser: {IDUser}");
                }

                // Nếu không truyền fieldName, trả về tất cả các trường và giá trị
                if (string.IsNullOrEmpty(fieldName))
                {
                    var allFields = typeof(LyLich2)
                        .GetProperties()
                        .ToDictionary(prop => prop.Name, prop => prop.GetValue(lyLich));
                    return Ok(allFields);
                }

                // Nếu truyền fieldName, trả về giá trị của trường cụ thể
                // Sử dụng Reflection để lấy giá trị của trường
                var property = typeof(LyLich2).GetProperty(fieldName);
                if (property == null)
                {
                    return BadRequest($"Field '{fieldName}' does not exist in LyLich2");
                }

                var value = property.GetValue(lyLich);
                return Ok(new { Field = fieldName, Value = value });
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        #nullable restore

        [HttpGet]
        [Route("GetUsersWithPublicData")]
        public async Task<IActionResult> GetUsersWithPublicData()
        {
            try
            {
                // Lấy toàn bộ danh sách User từ cơ sở dữ liệu
                var users = await _context.LyLich2.ToListAsync();

                var publicUsers = new List<object>();

                foreach (var user in users)
                {
                    // Kiểm tra nếu CongKhai rỗng hoặc null
                    if (string.IsNullOrWhiteSpace(user.CongKhai)) continue;

                    // Parse JSON từ trường CongKhai
                    var congKhaiList = JsonConvert.DeserializeObject<List<CongKhaiItem>>(user.CongKhai);

                    // Kiểm tra nếu "congKhai" có `checked = true`
                    var isPublicConfirmed = congKhaiList.FirstOrDefault(x => x.Key == "congKhai" && x.Checked == true);
                    if (isPublicConfirmed == null) continue;

                    publicUsers.Add(new { user.IDLyLich, user.ThongTinChung });
                }

                return Ok(publicUsers);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        [Route("GetUserPublicFields/{IDLyLich}")]
        public async Task<IActionResult> GetUserPublicFields(string IDLyLich)
        {
            try
            {
                var user = await _context.LyLich2.FirstOrDefaultAsync(u => u.IDLyLich == IDLyLich);
                if (user == null)
                {
                    return NotFound("Hồ sơ không tồn tại.");
                }

                // Parse JSON từ trường CongKhai
                var congKhaiList = JsonConvert.DeserializeObject<List<CongKhaiItem>>(user.CongKhai);

                // Kiểm tra điều kiện công khai
                var isPublicConfirmed = congKhaiList.FirstOrDefault(x => x.Key == "congKhai" && x.Checked == true);
                if (isPublicConfirmed == null)
                {
                    return Unauthorized("Hồ sơ không công khai.");
                }

                // Lấy các trường được công khai
                var publicFields = congKhaiList.Where(x => x.Key != "congKhai" && x.Checked == true).ToList();

                return Ok(new
                {
                    user.IDLyLich,
                    PublicFields = publicFields.Select(x => new { x.Key })
                });
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
