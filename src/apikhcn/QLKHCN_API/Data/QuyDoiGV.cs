using System.ComponentModel.DataAnnotations;

namespace QLKHCN_API.Data
{
    public class QuyDoiGV
    {
        [Key]
        public int ID { get; set; }

        [MaxLength(500)]
        public string LoaiSanPham { get; set; }

        [MaxLength(500)]
        public string MoTaLoaiSanPham { get; set; }

        [MaxLength(500)]
        public string TietChuan { get; set; }

        [MaxLength(500)]
        public string Diem { get; set; }
    }
}