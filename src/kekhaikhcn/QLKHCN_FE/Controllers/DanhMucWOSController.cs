using System;
using System.Web.Mvc;

namespace QLKHCN_FE.Controllers
{
    public class DanhMucWOSController : BaseController
    {
        // GET: DanhMuc
        public ActionResult Index(int? year)
        {
            if (!IsAuthenticated)
            {
                Session["ReturnUrl"] = Request.Url.AbsoluteUri;
                return RedirectToAction("Login", "NguoiDung");
            }
            if (!IsInRole("Quyền cao nhất"))
            {
                return RedirectToAction("AccessDenied", "Error");
            }

            // Nếu không có năm trong URL, mặc định lấy năm hiện tại
            if (!year.HasValue)
            {
                year = DateTime.Now.Year;
            }

            // Kiểm tra nếu năm không hợp lệ (nằm ngoài khoảng 5 năm từ hiện tại)
            if (year < DateTime.Now.Year - 5 || year > DateTime.Now.Year)
            {
                return new HttpStatusCodeResult(404, "Year not valid");
            }

            // Truyền year vào view để sử dụng
            ViewBag.Year = year;

            return View();
        }
    }
}