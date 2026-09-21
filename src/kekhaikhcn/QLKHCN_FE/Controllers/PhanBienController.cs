using System.Web.Mvc;

namespace QLKHCN_FE.Controllers
{
    public class PhanBienController : BaseController
    {
        public ActionResult Index()
        {
            if (!IsAuthenticated)
            {
                Session["ReturnUrl"] = Request.Url.AbsoluteUri;
                return RedirectToAction("Login", "NguoiDung");
            }

            return View();
        }

        public ActionResult BienTapChuyenMon()
        {
            if (!IsAuthenticated)
            {
                Session["ReturnUrl"] = Request.Url.AbsoluteUri;
                return RedirectToAction("Login", "NguoiDung");
            }

            return View();
        }
    }
}
