using System.Web.Mvc;

namespace QLKHCN_FE.Controllers
{
    public class DanhMucXetDuyetSinhVienController : BaseController
    {
        // GET: DanhMucXetDuyetSinhVien
        public ActionResult Index()
        {
            if (!IsAuthenticated)
            {
                Session["ReturnUrl"] = Request.Url.AbsoluteUri;
                return RedirectToAction("Login", "NguoiDung");
            }
            if (!IsInRole("Quyền cao nhất", "Quyền duyệt 1", "Quyền duyệt 2", "Quyền duyệt 3"))
            {
                return RedirectToAction("AccessDenied", "Error");
            }
            return View();
        }
    }
}
