using Microsoft.EntityFrameworkCore;

namespace QLKHCN_API.Data
{
    public class MyDbContext : DbContext
    {
        public MyDbContext(DbContextOptions options) : base(options)
        {
        }

        public DbSet<DanhMuc> DanhMuc { get; set; }
        public DbSet<DanhMucXetDuyet> DanhMucXetDuyet { get; set; }
        public DbSet<DanhMucXetDuyetSinhVien> DanhMucXetDuyetSinhVien { get; set; }
        public DbSet<QuyDoiGV> QuyDoiGV { get; set; }
        public DbSet<QuyDoiNCV> QuyDoiNCV { get; set; }
        public DbSet<ThanhToanGV> ThanhToanGV { get; set; }
        public DbSet<ThanhToanNCV> ThanhToanNCV { get; set; }
        public DbSet<NguoiDung> NguoiDung { get; set; }
        public DbSet<HoiDongKhoaHoc> HoiDongKhoaHoc { get; set; }
        public DbSet<DanhMucScimago> DanhMucScimago { get; set; }
        public DbSet<DanhMucScimago2023> DanhMucScimago2023 { get; set; }
        public DbSet<DanhMucWOS> DanhMucWOS { get; set; }
        public DbSet<DanhMucScopus> DanhMucScopus { get; set; }
        public DbSet<DanhMucHDGSNN> DanhMucHDGSNN { get; set; }
        public DbSet<LyLich> LyLich { get; set; }
        public DbSet<LyLich2> LyLich2 { get; set; }
        public DbSet<DanhMucTrongNuoc> DanhMucTrongNuoc { get; set; }
        public DbSet<CauHoi> CauHoi { get; set; }
        public DbSet<ThongBao> ThongBao { get; set; }
        public DbSet<CaiDatHeThong> CaiDatHeThong { get; set; }
    }
}