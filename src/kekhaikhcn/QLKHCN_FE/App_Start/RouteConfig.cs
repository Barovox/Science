using System.Web.Mvc;
using System.Web.Routing;

namespace QLKHCN_FE
{
    public class RouteConfig
    {
        public static void RegisterRoutes(RouteCollection routes)
        {
            routes.IgnoreRoute("{resource}.axd/{*pathInfo}");

            // Route dành cho các năm động (cụ thể cho WOS)
            routes.MapRoute(
                name: "DanhMucWOS",
                url: "DanhMucWOS{year}/{action}",
                defaults: new { controller = "DanhMucWOS", action = "Index", year = UrlParameter.Optional }
            );

            // Route dành cho các năm động (cụ thể cho Scopus)
            routes.MapRoute(
                name: "DanhMucScopus",
                url: "DanhMucScopus{year}/{action}",
                defaults: new { controller = "DanhMucScopus", action = "Index", year = UrlParameter.Optional }
            );

            // Route dành cho các năm động (cụ thể cho HDGSNN)
            routes.MapRoute(
                name: "DanhMucHDGSNN",
                url: "DanhMucHDGSNN{year}/{action}",
                defaults: new { controller = "DanhMucHDGSNN", action = "Index", year = UrlParameter.Optional }
            );

            routes.MapRoute(
                name: "DefaultWithToken",
                url: "{controller}/{action}/{id}/{request}",
                defaults: new { controller = "NguoiDung", action = "Login", id = UrlParameter.Optional, request = UrlParameter.Optional }
            );
        }

    }
}