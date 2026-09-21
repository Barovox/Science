using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace QLKHCN_FE.Controllers
{
    public class QuyDoiGVController : BaseController
    {
        // GET: QuyDoiGV
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

        public ActionResult Create()
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

        public ActionResult Edit(int id)
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