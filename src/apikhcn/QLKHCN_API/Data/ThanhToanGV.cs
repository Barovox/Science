using System.ComponentModel.DataAnnotations;

namespace QLKHCN_API.Data
{
    public class ThanhToanGV
    {
        [Key]
        public int ID { get; set; }

        [MaxLength(500)]
        public string LoaiSanPham { get; set; }

        [MaxLength(500)]
        public string YeuCauChatLuong { get; set; }

        [MaxLength(500)]
        public string KinhPhi { get; set; }

        [MaxLength(500)]
        public string MoTaLoaiSanPham { get; set; }
    }
}