using OfficeOpenXml;
using System.Collections.Generic;
using System.IO;
using System.Text.RegularExpressions;
using System;
using Xceed.Document.NET;

namespace QLKHCN_API.Data.HelpExport
{
    public class HelpExport
    {
        public static Stream UpdateDataIntoExcelTemplate(List<DanhMucXetDuyet> cList, FileInfo path)
        {
            Stream stream = new MemoryStream();
            if (path.Exists)
            {
                using (ExcelPackage p = new ExcelPackage(path))
                {
                    ExcelWorksheet wsEstimate = p.Workbook.Worksheets["Sheet1"];
                    wsEstimate.Cells["A9:Z119"].LoadFromCollection(cList);
                    p.SaveAs(stream);
                    stream.Position = 0;
                }
            }
            return stream;
        }

        public static void DataToTable(Table table, string[][] regexSplit)
        {
            Row headerRow = table.Rows[2];
            for (int i = table.Rows.Count - 1; i > 1; i--)
            {
                table.RemoveRow(i);
            }
            // Chèn dữ liệu vào bảng
            for (int i = 0; i < regexSplit.Length; i++)
            {
                Row newRow = table.InsertRow(headerRow, true); // Thêm một dòng mới vào bảng

                if (regexSplit[i].Length >= newRow.Cells.Count)
                {
                    for (int j = 0; j < regexSplit[i].Length && newRow.Cells.Count > j; j++)
                    {
                        if (string.IsNullOrWhiteSpace(regexSplit[i][j].ToString())) continue;
                        newRow.Cells[j].Paragraphs[0].ReplaceText(newRow.Cells[j].Paragraphs[0].Text, regexSplit[i][j]);
                    }
                }
            }
        }

        private static int SoDongHopLe(string[][] re)
        {
            int dem = 0;
            for (int x = 0; x < re.Length; x++)
            {
                if (re[x] == null) continue;
                int dem1 = 0;
                for (int y = 0; y < re[x].Length; y++)
                {
                    if (!String.IsNullOrWhiteSpace(re[x][y]))
                        dem1++;
                }
                if (dem1 != 0) dem++;
            }
            return dem;
        }

        public static string[][] regexSplit(string a, int col)
        {
            string[] rows = Regex.Split(a, @";\s");
            string[][] temp = new string[rows.Length][];
            string[][] re;

            int i = 0;
            foreach (string r in rows)
            {
                string[] parts = Regex.Split(r, @"\s-\s");

                if (parts.Length < col) continue;
                temp[i] = new string[col];
                for (int j = 0; j < temp[i].Length; j++)
                    temp[i][j] = parts[j];
                i++;
            }
            re = new string[SoDongHopLe(temp)][];
            for (int x = 0; x < re.Length; x++)
            {
                re[x] = new string[col];
                for (int y = 0; y < re[x].Length; y++)
                {
                    if (temp[x][y] == null) re[x][y] = "";
                    else re[x][y] = temp[x][y];
                }
            }

            return re;
        }
    }
}