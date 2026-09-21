using System.ComponentModel.DataAnnotations;

namespace QLKHCN_API.Data
{
    public class DanhMucHDGSNN
    {
        [Key]
        public int ID { get; set; }

        [MaxLength(10)]
        public string STT { get; set; }

        [MaxLength(200)]
        public string HOIDONGNGANH { get; set; }

        [MaxLength(200)]
        public string TENTAPCHI { get; set; }

        [MaxLength(100)]
        public string CHISOISSN { get; set; }

        [MaxLength(50)]
        public string LOAI { get; set; }

        [MaxLength(200)]
        public string COQUANXUATBAN { get; set; }

        [MaxLength(10)]
        public string DIEM { get; set; }
    }
}