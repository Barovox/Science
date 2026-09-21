using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using OfficeOpenXml.FormulaParsing.LexicalAnalysis;
using QLKHCN_API.Data;
using QLKHCN_API.ViewModels;
using System;
using System.Collections.Generic;
using System.Data;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using System.Web;

namespace QLKHCN_API.Controllers
{
    [Route("api/[controller]/")]
    [ApiController]
    [Authorize]

    public class NguoiDungController : ControllerBase
    {
        private readonly MyDbContext _context;
        private readonly IConfiguration _configuration;
        // See: https://learn.microsoft.com/en-us/aspnet/core/fundamentals/environments
        private readonly IWebHostEnvironment _environment; // Development, Staging, Production

        public NguoiDungController(MyDbContext context, IConfiguration configuration, IWebHostEnvironment environment)
        {
            _context = context;
            _configuration = configuration;
            _environment = environment;
        }

        [HttpGet]
        [Route("Get-user")]
        public async Task<ActionResult<IEnumerable<NguoiDung>>> Get_user(string input)
        {
            try
            {
                var result = await _context.NguoiDung.Where(a => a.IDUser.ToUpper().Contains(input.ToUpper()) || a.HoTen.ToUpper().Contains(input.ToUpper()) || a.DonViCongTac.ToUpper().Contains(input.ToUpper())).Take(5).ToListAsync();
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

        private string GenerateJwtToken(string hoTen, string userId, string role, string chucdanh)
        {
            var authClaims = new List<Claim>
            {
                new Claim("HoTen", hoTen),
                new Claim("IDUser", userId),
                new Claim("ChucDanh", chucdanh),
                new Claim(ClaimTypes.Role, role),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            };
            var authSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JWT:Secret"]));
            var token = new JwtSecurityToken(
                issuer: _configuration["JWT:ValidIssuer"],
                audience: _configuration["JWT:ValidAudience"],
                expires: DateTime.Now.AddHours(3),
                claims: authClaims,
                signingCredentials: new SigningCredentials(authSigningKey, SecurityAlgorithms.HmacSha256)
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
        ///
        [HttpPost]
        [Route("login2")]
        [AllowAnonymous]
        public async Task<IActionResult> Login2(string request)
        {
            var secretKey = "ByYM000OLlMQG6VVVp1OH7Xzyr7gHuw1qvUC5dcGt3SNM";
            try
            {
                var tokenHandler = new JwtSecurityTokenHandler();
                var key = Encoding.ASCII.GetBytes(secretKey);
                var tokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(key),
                    ValidateIssuer = false,
                    ValidateAudience = false
                };

                SecurityToken decodedToken;
                var principal = tokenHandler.ValidateToken(request, tokenValidationParameters, out decodedToken);

                var jwtPayload = new TempJWT
                {
                    HoTen = principal.Claims.FirstOrDefault(c => c.Type == "HoTen")?.Value,
                    IDUser = principal.Claims.FirstOrDefault(c => c.Type == "IDUser")?.Value,
                    ChucDanh = principal.Claims.FirstOrDefault(c => c.Type == "ChucDanh")?.Value,
                };

                var user = await _context.NguoiDung.FindAsync(jwtPayload.IDUser);
                string role = user?.quyen ?? "0";
                string chucdanh = user?.ChucDanh ?? "0";

                var token = GenerateJwtToken(jwtPayload.HoTen, jwtPayload.IDUser.ToUpper(), role, chucdanh);
                var jwtToken = new JwtSecurityTokenHandler().ReadJwtToken(token);
                return Ok(new
                {
                    token,
                    expiration = jwtToken.ValidTo
                });
            }
            catch (Exception ex)
            {
                // Xử lý lỗi nếu có
                return BadRequest(new { error = "Đã xảy ra lỗi trong quá trình giải mã token." });
            }

        }
        ///
        public class TempJWT
        {
            public string HoTen { get; set; }
            public string IDUser { get; set; }
            public string ChucDanh { get; set; }
        }
        [HttpPost]
        [Route("login")]
        [AllowAnonymous]
        public async Task<IActionResult> Login([FromBody] LoginModel request)
        {
            if (_environment.IsProduction())
            {
                var client = new HttpClient();
                var json1 = JsonConvert.SerializeObject(request);
                var content1 = new StringContent(json1);
                content1.Headers.ContentType = new MediaTypeHeaderValue("application/json");
                //var response = await client.PostAsync("https://api.hutech.edu.vn/authentication-v2/api/auth/login-science", content1);
                var response = await client.PostAsync("https://portal.uef.edu.vn/api/users/auth/login-science", content1);

                if (response.IsSuccessStatusCode)
                {
                    var responseContent1 = await response.Content.ReadAsStringAsync();
                    dynamic obj1 = JsonConvert.DeserializeObject(responseContent1);

                    string userId = obj1.data.nhanVienID;//obj1.data.NhanVienID;
                    string hoTen = obj1.data.hoTen; //obj1.data.HoTen;
                    var user = await _context.NguoiDung.FindAsync(userId);
                    string role = user?.quyen ?? "0";
                    string chucdanh = user?.ChucDanh ?? "0";

                    var token = GenerateJwtToken(hoTen, userId.ToUpper(), role, chucdanh);
                    var jwtToken = new JwtSecurityTokenHandler().ReadJwtToken(token);
                    return Ok(new
                    {
                        token,
                        expiration = jwtToken.ValidTo
                    });
                }
                else
                {

                    var responseContent1 = await response.Content.ReadAsStringAsync();
                    dynamic obj1 = JsonConvert.DeserializeObject(responseContent1);
                    string code1 = obj1.data.code;
                    string message1 = obj1.data.message;
                    if (code1 == "109" || code1 == "104")
                    {
                        ResponseVM res = new ResponseVM(code1, message1);
                        return BadRequest(res);
                    }
                    var user = await _context.NguoiDung.FirstOrDefaultAsync(a => a.IDUser == request.username);
                    string role = "0";
                    if (user != null)
                    {
                        string chucdanh = user.ChucDanh ?? "0";
                        if (user.quyen != null)
                        {
                            role = user.quyen;
                        }
                        var token = GenerateJwtToken(user.HoTen, user.IDUser, role, chucdanh);
                        var jwtToken = new JwtSecurityTokenHandler().ReadJwtToken(token);
                        return Ok(new
                        {
                            token,
                            expiration = jwtToken.ValidTo
                        });
                    }
                    return Unauthorized();
                }
            }
            else
            {
                var user = await _context.NguoiDung.FirstOrDefaultAsync(a => a.IDUser.ToUpper().Equals(request.username.ToUpper()));
                string role = "0";
                if (user != null)
                {
                    string chucdanh = user.ChucDanh ?? "0";
                    if (user.quyen != null)
                    {
                        role = user.quyen;
                    }
                    var token = GenerateJwtToken(user.HoTen, user.IDUser, role, chucdanh);
                    var jwtToken = new JwtSecurityTokenHandler().ReadJwtToken(token);
                    return Ok(new
                    {
                        token,
                        expiration = jwtToken.ValidTo
                    });
                }
                return Unauthorized();
            }
        }

        [HttpGet]
        [Route("Get-user-id")]
        public async Task<ActionResult<IEnumerable<NguoiDung>>> Get_user_id(string input)
        {
            string decodedHtml = HttpUtility.HtmlDecode(input);
            try
            {
                var result = await _context.NguoiDung.Where(a => a.IDUser.ToUpper().Equals(decodedHtml.ToUpper())).ToListAsync();
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
        [Route("GetID")]
        public async Task<ActionResult<NguoiDung>> GetID(string id)
        {
            try
            {
                var result = await _context.NguoiDung.Where(a => a.IDUser.ToUpper().Equals(id.ToUpper())).FirstOrDefaultAsync();
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
        public async Task<ActionResult<IEnumerable<NguoiDung>>> GetAll()
        {
            try
            {
                return Ok(await _context.NguoiDung.ToListAsync());
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut]
        [Route("Update/{IDUser}")]
        public async Task<IActionResult> Update(string IDUser, [FromBody] string quyen)
        {
            try
            {
                var nguoidung = await _context.NguoiDung.FirstOrDefaultAsync(a => a.IDUser == IDUser);
                if (nguoidung == null)
                {
                    return NotFound();
                }
                nguoidung.quyen = quyen;

                await _context.SaveChangesAsync();
                return Ok(nguoidung);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        //[HttpPut]
        //[Route("Update/info/{IDUser}")]
        //public async Task<IActionResult> Update(string IDUser, NguoiDung nguoiDung)
        //{

        //    if (IDUser != nguoiDung.IDUser)
        //    {
        //        return BadRequest();
        //    }

        //    var existingUser = await _context.NguoiDung.FindAsync(IDUser);

        //    if (existingUser == null)
        //    {
        //        return NotFound();
        //    }

        //    nguoiDung.Password = existingUser.Password;
        //    nguoiDung.DonViCongTac = existingUser.DonViCongTac;
        //    nguoiDung.quyen = existingUser.quyen;
        //    nguoiDung.HoTen = existingUser.HoTen;
        //    nguoiDung.Password = existingUser.Password;
        //    _context.Entry(existingUser).CurrentValues.SetValues(nguoiDung);

        //    try
        //    {
        //        await _context.SaveChangesAsync();
        //    }
        //    catch (DbUpdateConcurrencyException)
        //    {
        //        return NotFound();
        //    }

        //    return NoContent();
        //}
    }
}
