using System;

namespace QLKHCN_API.ViewModels
{
    public class DMXDSV_FileThanhLyHopDong
    {
        public int IDDanhMuc { get; set; }
        public string fileThanhLyHopDong { get; set; }
        public string fileBaiBaoHopHoiDong { get; set; }
        public string fileQuyetDinhCongNhanDeTai { get; set; }
        public string fileStatus { get; set; }
        public DateTime? dateSubmit_now { get; set; }
    }
}
