using System.Web.Mvc;

namespace QLKHCN_FE.Controllers
{
    public class DanhMucTrongNuocController : BaseController
    {
        // GET: DanhMuc
        public ActionResult Index()
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
            return View();
        }
    }
}