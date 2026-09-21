using System.Collections.Generic;
using System.Linq;

namespace QLKHCN_API.Data.HelpExport
{
    public class LyLichData
    {
        public List<string> data = new List<string>();

        public LyLichData( List<string> parts)
        {
            data.AddRange(parts);
        }
    }
    public class LyLichDataItem
    {
        public List<string> data { get; set; }
    }
    public class ListLyLichDataItem
    {
        private List<LyLichDataItem> dataList;

        public int col { get; set; }
        public List<LyLichDataItem> data { get; set; }
    }

}
