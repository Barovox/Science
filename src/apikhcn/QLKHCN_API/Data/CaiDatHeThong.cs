using System.ComponentModel.DataAnnotations;

namespace QLKHCN_API.Data
{
    public class CaiDatHeThong
    {
        [Key]
        [MaxLength(255)]
        public string id { get; set; }

        public string value { get; set; }
    }
}
