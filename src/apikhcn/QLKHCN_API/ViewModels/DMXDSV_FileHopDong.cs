using System;

namespace QLKHCN_API.ViewModels
{
    public class DMXDSV_FileHopDong
    {
        public int IDDanhMuc { get; set; }
        public string fileThuyetMinhHoanChinh { get; set; }
        public string fileHopDong { get; set; }
        public string fileQuyetDinhGiaoNhiemVu { get; set; }
        public string fileStatus { get; set; }
        public DateTime? dateSubmit_now { get; set; }
    }
}
