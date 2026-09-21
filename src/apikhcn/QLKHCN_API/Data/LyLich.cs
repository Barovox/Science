using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace QLKHCN_API.Data
{
    public class LyLich
    {
        [ForeignKey("NguoiDung")]
        [Key]
        public string IDLyLich { get; set; }

        public string QuaTrinhDaoTao { get; set; }
        public string QuaTrinhCongTac { get; set; }
        public string CongTrinhCongBo { get; set; }
        public string SoLuongVanBang { get; set; }
        public string SoCongTrinh { get; set; }
        public string ChuTriHoacThamGia { get; set; }
        public string GiaiThuong { get; set; }
        public string ThanhTuu { get; set; }

        public virtual NguoiDung NguoiDung { get; set; }
    }
}