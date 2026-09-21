using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace QLKHCN_API.Data
{
    public class HoiDongKhoaHoc
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int ID { get; set; }

        [Key]
        [MaxLength(1000)]
        public string Email { get; set; }

        [JsonIgnore]
        [MaxLength(1000)]
        public string MatKhau { get; set; }

        [MaxLength(1000)]
        public string HoTen { get; set; }

        [MaxLength(10)]
        public string ChucDanh { get; set; }

        [MaxLength(1000)]
        public string LinhVucChuyenMon { get; set; }

        public string CoQuanCongTac { get; set; }

        public string QuocGia { get; set; }
    }
}
