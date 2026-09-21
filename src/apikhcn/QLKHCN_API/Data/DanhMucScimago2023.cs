using System;
using System.ComponentModel.DataAnnotations;

namespace QLKHCN_API.Data
{
	public class DanhMucScimago2023
	{
        [Key]
        public int number { get; set; }

        [MaxLength(500)]
        public string journal_name { get; set; }

        [MaxLength(500)]
        public string issn { get; set; }

        [MaxLength(500)]
        public string eissn { get; set; }

        [MaxLength(500)]
        public string category_1 { get; set; }

        [MaxLength(500)]
        public string category_2 { get; set; }

        [MaxLength(500)]
        public string category_3 { get; set; }

        [MaxLength(500)]
        public string category_4 { get; set; }

        [MaxLength(500)]
        public string category_5 { get; set; }

        [MaxLength(500)]
        public string category_6 { get; set; }

        [MaxLength(500)]
        public string category_7 { get; set; }

        [MaxLength(500)]
        public string category_8 { get; set; }


        [MaxLength(500)]
        public string category_9 { get; set; }

        [MaxLength(500)]
        public string category_10 { get; set; }

        [MaxLength(500)]
        public string category_11 { get; set; }

        [MaxLength(500)]
        public string category_12 { get; set; }

    }
}

