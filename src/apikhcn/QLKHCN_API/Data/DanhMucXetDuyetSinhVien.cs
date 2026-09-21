using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;

namespace QLKHCN_API.Data
{
    public class DanhMucXetDuyetSinhVien
    {
        [Key]
        public int IDDanhMuc { get; set; }

        [MaxLength(1000)]
        public string userId { get; set; }

        [MaxLength(1000)]
        public string tenBaiBao { get; set; }

        [MaxLength(1000)]
        public string moTaBaiBao { get; set; }

        public int thoiGianThucHien { get; set; }

        [MaxLength(4000)]
        public string groupUser { get; set; }

        [MaxLength(1000)]
        public string jci { get; set; }

        [MaxLength(1000)]
        public string quantity { get; set; }

        [MaxLength(1000)]
        public string category { get; set; }

        public Int64 kinhPhi { get; set; }

        [MaxLength(2000)]
        public string ghiChu { get; set; }
        
        public DateTime? dateSubmit { get; set; }
        
        public DateTime? dateSubmit_now { get; set; }

        public string fileDangKy { get; set; }
        public string fileThuyetMinh { get; set; }
        public string fileDinhKemLyLich { get; set; }
        public string fileThuyetMinhHoanChinh { get; set; }
        public string fileHopDong { get; set; }
        public string fileQuyetDinhGiaoNhiemVu { get; set; }
        public string fileDangKyNghiemThu { get; set; }
        public string fileMinhChungNghiemThu { get; set; }
        public string fileGiaHanThucHienDeTai { get; set; }
        public string fileThanhLyHopDong { get; set; }
        public string fileBaiBaoHopHoiDong { get; set; }
        public string fileQuyetDinhCongNhanDeTai { get; set; }
        public string fileThongTinNghiemThu { get; set; }

        public string adminFileList { get; set; }

        // Thuộc tính không được ánh xạ, sử dụng để thao tác với List<string>
        [NotMapped]
        public List<string> fileList
        {
            get
            {
                // Chuyển đổi từ chuỗi thành List<string> khi cần
                return string.IsNullOrEmpty(adminFileList) ? new List<string>() : adminFileList.Split(';').ToList();
            }
            set
            {
                // Chuyển đổi từ List<string> thành chuỗi khi lưu
                adminFileList = string.Join(";", value);
            }
        }

        [MaxLength(1000)]
        public string status { get; set; }

        [MaxLength(1000)]
        public string status_hopDong { get; set; }

        [MaxLength(1000)]
        public string status_nghiemThu { get; set; }

        [MaxLength(12)]
        public string fileStatus { get; set; }

        public string? danhSachHDXetDuyet { get; set; }
        public string? danhSachHDNghiemThu { get; set; }

        public string? lichSuXuLy { get; set; }

        [MaxLength(1000)]
        public string review1 { get; set; }

        [MaxLength(1000)]
        public string review2 { get; set; }

        [MaxLength(1000)]
        public string rejectBy { get; set; }

        [MaxLength(1000)]
        public string completedBy { get; set; }

        public string? hoiDongDanhGia { get; set; }
    }
}
