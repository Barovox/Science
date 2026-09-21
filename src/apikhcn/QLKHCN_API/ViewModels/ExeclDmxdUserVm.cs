using QLKHCN_API.Data;
using System;
using System.Collections.Generic;
using Xceed.Document.NET;

namespace QLKHCN_API.ViewModels
{
    public class ExeclDmxdUserVm
    {
        public string userId { get; set; }
        public string ho { get; set; }
        public string ten { get; set; }
        public string tenCongTrinh { get; set; }
        public string loaiCongTrinh { get; set; }
        public string soTacGia { get; set; }
        public string dongGop { get; set; }
        public string tietChuan { get; set; }
        public string diem { get; set; }
        public string khoa { get; set; }
        public string total { get; set; }
        public string thue { get; set; }
        public string thunhap { get; set; }
        public string DonViCongTac { get; set; }
        public string image { get; set; }
        public List<string> fileList { get; set; }
        public string jci { get; set; }
        public DateTime? dateSubmit { get; set; }
    }
}