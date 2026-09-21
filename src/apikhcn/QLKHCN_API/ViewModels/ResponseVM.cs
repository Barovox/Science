namespace QLKHCN_API.ViewModels
{
    public class ResponseVM
    {
        public string code { get; set; }
        public string message { get; set; }

        public ResponseVM(string code, string message)
        {
            this.code = code;
            this.message = message;
        }
    }
}