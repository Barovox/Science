using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;

namespace QLKHCN_API.Data
{
    public class CauHoi
    {
        [Key]
        public int IDCauHoi { get; set; }

        public string TieuDe { get; set; }

        public string MoTa { get; set; }

        public string DinhKem { get; set; }

        // Thuộc tính không được ánh xạ, sử dụng để thao tác với List<string>
        [NotMapped]
        public List<string> DanhSachDinhKem
        {
            get
            {
                // Chuyển đổi từ chuỗi thành List<string> khi cần
                return string.IsNullOrEmpty(DinhKem) ? new List<string>() : DinhKem.Split(';').ToList();
            }
            set
            {
                // Chuyển đổi từ List<string> thành chuỗi khi lưu
                DinhKem = string.Join(";", value);
            }
        }

        public string TraLoi { get; set; }

        [MaxLength(1000)]
        public string PhanLoai { get; set; }

        [MaxLength(1000)]
        public string q_by { get; set; }

        [MaxLength(1000)]
        public string a_by { get; set; }

        public DateTime? q_dateSubmit { get; set; }

        public DateTime? a_dateSubmit { get; set; }

        public bool? CongKhai { get; set; }

        public bool? ThuongGap { get; set; }
    }
}
