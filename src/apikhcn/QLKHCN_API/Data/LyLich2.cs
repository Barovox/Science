using System.ComponentModel.DataAnnotations;

namespace QLKHCN_API.Data
{
    public class LyLich2
    {
        [Key]
        public string IDLyLich { get; set; }

        public string ThongTinChung { get; set; }

        public string QuaTrinhGiangDayCongTac { get; set; }

        public string DuAnThamGia_UniversityFund { get; set; }
        public string DuAnThamGia_ProvinceGrants { get; set; }
        public string DuAnThamGia_NationalGrants { get; set; }
        public string DuAnThamGia_InternationalGrants { get; set; }

        public string HuongDan_Master { get; set; }
        public string HuongDan_PhD { get; set; }
        public string HuongDan_Postdoc { get; set; }

        public string BaiBao_ThuocWosScopus { get; set; }
        public string BaiBao_QuocTeKhongThuocWosScopus { get; set; }
        public string BaiBao_HDCDGSNN { get; set; }
        public string BaiBao_Conference { get; set; }
        public string BaiBao_Book { get; set; }
        public string BaiBao_BookChapter { get; set; }
        public string BaiBao_SangChe { get; set; }

        public string GiaiThuong_TrongNuoc { get; set; }
        public string GiaiThuong_QuocTe { get; set; }

        public string HocPhanMonGiangDay { get; set; }

        public string NhomNghienCuuUEF { get; set; }

        public string CongKhai { get; set; }
    }
}
