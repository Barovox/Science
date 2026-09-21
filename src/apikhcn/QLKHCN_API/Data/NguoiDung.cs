using System;
using System.ComponentModel.DataAnnotations;

namespace QLKHCN_API.Data
{
    public class NguoiDung
    {
        [Key]
        [MaxLength(30)]
        public string IDUser { get; set; }

        [MaxLength(50)]
        public string Password { get; set; }

        [MaxLength(100)]
        public string HoTen { get; set; }

        [MaxLength(10)]
        public string GioiTinh { get; set; }

        public DateTime? NgaySinh { get; set; }

        [MaxLength(20)]
        public string CCCD { get; set; }

        [MaxLength(100)]
        public string ChucDanh { get; set; }

        [MaxLength(100)]
        public string ChucVu { get; set; }

        [MaxLength(500)]
        public string DonViCongTac { get; set; }

        [MaxLength(500)]
        public string PhongBan { get; set; }

        [MaxLength(500)]
        public string DiaChi { get; set; }

        [MaxLength(50)]
        public string TinhThanh { get; set; }

        [MaxLength(100)]
        public string EmailChinh { get; set; }

        [MaxLength(100)]
        public string EmailThayThe { get; set; }

        [MaxLength(20)]
        public string SDTCoQuan { get; set; }

        [MaxLength(20)]
        public string SDTDD { get; set; }

        [MaxLength(100)]
        public string quyen { get; set; }

        // public bool? CongKhai { get; set; }
    }
}