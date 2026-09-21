using QLKHCN_FE.ViewModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace QLKHCN_FE.Controllers
{
    public class BaseController : Controller
    {
        public bool IsAuthenticated
        {
            get
            {
                return HttpContext.Session["CurrentUser"] != null;
            }
        }

        public bool IsInRole(params string[] roleNames)
        {
            var user = HttpContext.Session["CurrentUser"] as UserLogin;

            if (user == null)
            {
                return false;
            }

            foreach (var roleName in roleNames)
            {
                if (!string.IsNullOrEmpty(user.Role) && user.Role == roleName)
                {
                    return true;
                }
            }

            return false;
        }
    }
}