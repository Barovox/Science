using OfficeOpenXml;
using QLKHCN_API.ViewModels;
using System.Collections.Generic;
using System.IO;
using System;
using System.Net;
using System.Security.Policy;
using System.Threading.Tasks;
using System.Linq;

namespace QLKHCN_API.Data.HelpExport
{
    public class ExportKhoa
    {
        public static MemoryStream UpdateDataIntoExcelTemplateKhoaVien(List<ExeclDmxdUserVm> dataList, FileInfo templateFileInfo, DateTime currentDate)
        {
            using (var package = new ExcelPackage(templateFileInfo))
            {
                var worksheet = package.Workbook.Worksheets["Sheet1"];
                int startRow = 9;
                int templateRow = startRow;

                for (int i = 0; i < dataList.Count; i++)
                {
                    int rowIndex = startRow + i;

                    if (i > 0)
                    {
                        worksheet.InsertRow(rowIndex, 1, templateRow);
                    }

                    var item = dataList[i];
                    worksheet.Cells[$"A{rowIndex}"].Value = i + 1;
                    worksheet.Cells[$"B{rowIndex}"].Value = item.userId;
                    worksheet.Cells[$"C{rowIndex}"].Value = item.ho;
                    worksheet.Cells[$"D{rowIndex}"].Value = item.ten;
                    worksheet.Cells[$"E{rowIndex}"].Value = item.tenCongTrinh;
                    worksheet.Cells[$"F{rowIndex}"].Value = item.loaiCongTrinh;
                    // convert item.dateSubmit to string with format "dd/MM/yyyy"
                    worksheet.Cells[$"G{rowIndex}"].Value = 
                        item.dateSubmit.HasValue ? item.dateSubmit.Value.ToString("dd/MM/yyyy") : string.Empty;
                    worksheet.Cells[$"H{rowIndex}"].Value = item.soTacGia;
                    worksheet.Cells[$"I{rowIndex}"].Value = item.dongGop;
                    worksheet.Cells[$"J{rowIndex}"].Value = item.tietChuan;
                    worksheet.Cells[$"K{rowIndex}"].Value = item.diem;
                    worksheet.Cells[$"L{rowIndex}"].Value = item.thunhap;
                    string input = item.jci;
                    int firstCommaIndex = input.IndexOf(',');
                    int firstSpaceIndex = input.IndexOf(' ');

                    int endIndex = (firstCommaIndex != -1 && (firstCommaIndex < firstSpaceIndex || firstSpaceIndex == -1))
                        ? firstCommaIndex
                        : firstSpaceIndex;
                    if (endIndex > 0)
                    {
                        string result = input.Substring(0, endIndex);
                        // sử dụng nếu cần
                    }
                }


                string dateString = worksheet.Cells["H5"].Value.ToString()
                    .Replace("{date}", currentDate.Day.ToString())
                    .Replace("{month}", currentDate.Month.ToString())
                    .Replace("{year}", currentDate.Year.ToString());
                worksheet.Cells["H5"].Value = dateString;

                string khoaString = worksheet.Cells["B3"].Value.ToString()
                    .Replace("{khoa}", dataList[0].khoa);
                worksheet.Cells["B3"].Value = khoaString;

                MemoryStream stream = new MemoryStream(package.GetAsByteArray());
                return stream;
            }
        }
        public void DownloadFile(string url, string destinationPath)
        {
            using (var client = new WebClient())
            {
                client.DownloadFile(url, destinationPath);
            }
        }
        public static MemoryStream UpdateDataIntoExcelTemplateNCM(List<ExeclDmxdUserVm> dataList, FileInfo templateFileInfo, DateTime currentDate)
        {
            using (var package = new ExcelPackage(templateFileInfo))
            {
                var worksheet = package.Workbook.Worksheets["Sheet1"];

                int templateRowIndex = 7;
                int dataRowIndex = templateRowIndex + 1;
                int stt = 1;
                try
                {
                    // Sao chép format từ dòng template (dòng 7)
                    worksheet.InsertRow(dataRowIndex, dataList.Count);
                    CopyRowFormat(worksheet, templateRowIndex, dataRowIndex, dataList.Count);
                
                    foreach (var item in dataList)
                    {
                        //if (item.total != "0" && item.userId != "" && item.ho != "" && item.ten != "")
                        if (item.total != "0" )
                        {
                            worksheet.Cells[$"A{dataRowIndex - 1}"].Value = stt;
                            worksheet.Cells[$"B{dataRowIndex - 1}"].Value = item.userId;
                            worksheet.Cells[$"C{dataRowIndex - 1}"].Value = item.ho;
                            worksheet.Cells[$"D{dataRowIndex - 1}"].Value = item.ten;
                            worksheet.Cells[$"E{dataRowIndex - 1}"].Value = item.tenCongTrinh;
                            worksheet.Cells[$"G{dataRowIndex - 1}"].Value = item.total;
                            worksheet.Cells[$"H{dataRowIndex - 1}"].Value = item.thue;
                            worksheet.Cells[$"I{dataRowIndex - 1}"].Value = item.thunhap;
                            worksheet.Cells[$"J{dataRowIndex - 1}"].Value = "0";
                            worksheet.Cells[$"K{dataRowIndex - 1}"].Value = item.thunhap;
                            worksheet.Cells[$"L{dataRowIndex - 1}"].Value = item.loaiCongTrinh;
                            if (item.loaiCongTrinh == "Q1" || item.loaiCongTrinh == "Q2" || item.loaiCongTrinh == "Q3")
                            {
                                worksheet.Cells[$"F{dataRowIndex - 1}"].Value = "24.000.000";
                            }
                            else if (item.loaiCongTrinh == "Q4")
                            {
                                worksheet.Cells[$"F{dataRowIndex - 1}"].Value = "0";
                            }
                            else if (item.loaiCongTrinh.Contains("Q1"))
                            {
                                worksheet.Cells[$"F{dataRowIndex - 1}"].Value = "100.000.000";
                            }
                            else if (item.loaiCongTrinh.Contains("Q2"))
                            {
                                worksheet.Cells[$"F{dataRowIndex - 1}"].Value = "80.000.000";
                            }
                            else if (item.loaiCongTrinh.Contains("Q3"))
                            {
                                worksheet.Cells[$"F{dataRowIndex - 1}"].Value = "60.000.000";
                            }
                            else if (item.loaiCongTrinh.Contains("Q4"))
                            {
                                worksheet.Cells[$"F{dataRowIndex - 1}"].Value = "40.000.000";
                            }
                            else
                            {
                                worksheet.Cells[$"F{dataRowIndex - 1}"].Value = item.loaiCongTrinh;
                            }
                            
                            if (!string.IsNullOrEmpty(item.image))
                            {
                                worksheet.Cells[$"M{dataRowIndex - 1}"].Value = "https://khcn.uef.edu.vn/" + item.image;
                                worksheet.Cells[$"M{dataRowIndex - 1}"].Hyperlink = new ExcelHyperLink("https://khcn.uef.edu.vn/" + item.image, UriKind.Absolute);
                            }
                            else if (item.fileList != null)
                            {
                                // Khởi tạo chuỗi danh sách có bullet
                                string bulletList = string.Join(Environment.NewLine, item.fileList.Select(link => $"• https://khcn.uef.edu.vn{link}"));

                                // Ghi danh sách vào ô Excel
                                worksheet.Cells[$"M{dataRowIndex - 1}"].Value = bulletList;
                            }
                            
                            string input = item.jci;
                            int firstCommaIndex = input.IndexOf(',');
                            int firstSpaceIndex = input.IndexOf(' ');

                            int endIndex;
                            if (firstCommaIndex != -1 && firstCommaIndex < firstSpaceIndex)
                            {
                                endIndex = firstCommaIndex;
                            }
                            else
                            {
                                endIndex = firstSpaceIndex;
                            }

                            string result = input.Substring(0, endIndex);

                            // TODO: không cần thiết phải tạo và download các minh chứng này
                            //string directoryPath = "/Users/nguyenluan/Desktop/" + result;
                            //Directory.CreateDirectory(directoryPath);

                            //string downloadUrl = $"{Guid.NewGuid()}{Path.GetExtension(item.image)}";
                            //try
                            //{
                            //    using (WebClient client = new WebClient())
                            //    {
                            //        string downloadPath = Path.Combine(directoryPath, downloadUrl);
                            //        client.DownloadFile("https://khcn.uef.edu.vn/" + item.image.ToString(), downloadPath);
                            //    }
                            //}
                            //catch { }
                            stt++;
                            dataRowIndex++;
                         }


                    }
               

                string dateString = worksheet.Cells["A4"].Value.ToString()
                    .Replace("{year}", currentDate.Year.ToString());
                worksheet.Cells["A4"].Value = dateString;
                }
                catch { }
                MemoryStream stream = new MemoryStream(package.GetAsByteArray());

                return stream;
                
            }
        }

        private static void CopyRowFormat(ExcelWorksheet worksheet, int sourceRowIndex, int targetRowIndex, int rowCount)
        {
            for (int i = 0; i < rowCount; i++)
            {
                for (int col = 1; col <= worksheet.Dimension.Columns; col++)
                {
                    var sourceCell = worksheet.Cells[sourceRowIndex, col];
                    var targetCell = worksheet.Cells[targetRowIndex + i, col];
                    targetCell.StyleID = sourceCell.StyleID;
                }
                worksheet.Row(targetRowIndex + i).Height = worksheet.Row(sourceRowIndex).Height;
            }
        }
    }
}
