using System.ComponentModel.DataAnnotations;

namespace QLKHCN_API.Data
{
    public class ThanhToanNCV
    {
        [Key]
        public int ID { get; set; }

        [MaxLength(500)]
        public string SanPhamKHCN { get; set; }

        [MaxLength(500)]
        public string TCNCKH { get; set; }

        [MaxLength(500)]
        public string KinhPhi { get; set; }

        [MaxLength(500)]
        public string MoTaSanPhamKHCN { get; set; }
    }
}