using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;

namespace QLKHCN_API.Data
{
    public class DanhMucXetDuyet
    {
        [Key]
        public int IDDanhMuc { get; set; }

        [MaxLength(1000)]
        public string journal_name { get; set; }

        [MaxLength(50)]
        public string issn { get; set; }

        [MaxLength(50)]
        public string eissn { get; set; }

        [MaxLength(1000)]
        public string category { get; set; }

        [MaxLength(2000)]
        public string citations { get; set; }

        [MaxLength(4000)]
        public string if_2022 { get; set; }

        [MaxLength(1000)]
        public string jci { get; set; }

        [MaxLength(1000)]
        public string percentageOAGold { get; set; }

        [MaxLength(1000)]
        public string userId { get; set; }

        [MaxLength(50)]
        public string rank { get; set; }

        [MaxLength(1000)]
        public string imageTenBB { get; set; }

        [MaxLength(2000)]
        public string image { get; set; }

        public string FileListString { get; set; }

        // Thuộc tính không được ánh xạ, sử dụng để thao tác với List<string>
        [NotMapped]
        public List<string> fileList
        {
            get
            {
                // Chuyển đổi từ chuỗi thành List<string> khi cần
                return string.IsNullOrEmpty(FileListString) ? new List<string>() : FileListString.Split(';').ToList();
            }
            set
            {
                // Chuyển đổi từ List<string> thành chuỗi khi lưu
                FileListString = string.Join(";", value);
            }
        }


        [MaxLength(1000)]
        public string link { get; set; }

        [MaxLength(1000)]
        public string tenBaiBao { get; set; }

        [MaxLength(1000)]
        public string type { get; set; }

        [MaxLength(4000)]
        public string groupUser { get; set; }

        [MaxLength(1000)]
        public string status { get; set; }

        [MaxLength(1000)]
        public string quantity { get; set; }

        [MaxLength(1000)]
        public string total { get; set; }

        [MaxLength(2000)]
        public string ghiChu { get; set; }

        [MaxLength(1000)]
        public string loaiHinhKeKhai { get; set; }
        [MaxLength(1000)]
        public string loaiCongTrinh { get; set; }
        public DateTime? dateSubmit { get; set; }

        public DateTime? dateSubmit_now { get; set; }

        [MaxLength(1000)]
        public string review1 { get; set; }

        [MaxLength(1000)]
        public string review2 { get; set; }

        [MaxLength(1000)]
        public string rejectBy { get; set; }

        [MaxLength(1000)]
        public string completedBy { get; set; }
    }
}