using System;

namespace QLKHCN_API.ViewModels
{
    public class NhanXetHoiDongRequest
    {
        public int Id { get; set; }
        public string FromHoiDong { get; set; }
        public string CommentForGroup { get; set; }
        public string CommentForHoiDong { get; set; }
        public string PhieuDanhGia { get; set; }
        public string KetLuan { get; set; }
    }
}
