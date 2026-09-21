using System.ComponentModel.DataAnnotations;

namespace QLKHCN_API.Data
{
    public class DanhMuc
    {
        [Key]
        public int IDDanhMuc { get; set; }

        [MaxLength(500)]
        public string journal_name { get; set; }

        [MaxLength(50)]
        public string issn { get; set; }

        [MaxLength(50)]
        public string eissn { get; set; }

        [MaxLength(100)]
        public string category_1 { get; set; }

        [MaxLength(100)]
        public string category_2 { get; set; }

        [MaxLength(100)]
        public string category_3 { get; set; }

        [MaxLength(500)]
        public string category_4 { get; set; }

        [MaxLength(100)]
        public string category_5 { get; set; }

        [MaxLength(100)]
        public string category_6 { get; set; }

        [MaxLength(50)]
        public string citations { get; set; }

        [MaxLength(50)]
        public string if_2022 { get; set; }

        [MaxLength(10)]
        public string jci { get; set; }

        [MaxLength(15)]
        public string percentageOAGold { get; set; }
    }
}