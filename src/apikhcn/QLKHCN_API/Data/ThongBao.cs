using System;
using System.ComponentModel.DataAnnotations;

namespace QLKHCN_API.Data
{
    public class ThongBao
    {
        [Key]
        public int Id { get; set; }

        [MaxLength(30)]
        public string UserId { get; set; }

        public string Message { get; set; }

        public bool IsRead { get; set; }

        public DateTime CreatedAt { get; set; }
    }
}
