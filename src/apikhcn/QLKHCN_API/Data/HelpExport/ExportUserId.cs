using OfficeOpenXml;
using QLKHCN_API.ViewModels;
using System;
using System.Collections.Generic;
using System.IO;

namespace QLKHCN_API.Data
{
    public class ExportUserId
    {
        public MemoryStream UpdateDataIntoExcelTemplateKhoaVien(List<ExeclDmxdUserVm> dataList, FileInfo templateFileInfo, DateTime currentDate)
        {
            using (var package = new ExcelPackage(templateFileInfo))
            {
                var worksheet = package.Workbook.Worksheets["Sheet1"];

                int rowIndex = 9;
                int stt = 1;

                foreach (var item in dataList)
                {
                    if (item.total == "0")
                    {
                        worksheet.Cells[$"A{rowIndex}"].Value = stt;
                        worksheet.Cells[$"B{rowIndex}"].Value = item.userId;
                        worksheet.Cells[$"C{rowIndex}"].Value = item.ho;
                        worksheet.Cells[$"D{rowIndex}"].Value = item.ten;
                        worksheet.Cells[$"E{rowIndex}"].Value = item.tenCongTrinh;
                        worksheet.Cells[$"F{rowIndex}"].Value = item.loaiCongTrinh;
                        worksheet.Cells[$"G{rowIndex}"].Value = item.soTacGia;
                        worksheet.Cells[$"H{rowIndex}"].Value = item.dongGop;
                        worksheet.Cells[$"I{rowIndex}"].Value = item.tietChuan;
                        worksheet.Cells[$"J{rowIndex}"].Value = item.diem;
                        rowIndex++;
                        stt++;
                    }
                }


                string dateString = worksheet.Cells["G5"].Value.ToString()
                    .Replace("{date}", currentDate.Day.ToString())
                    .Replace("{month}", currentDate.Month.ToString())
                    .Replace("{year}", currentDate.Year.ToString());
                worksheet.Cells["G5"].Value = dateString;

                string khoaString = worksheet.Cells["B3"].Value.ToString()
                    .Replace("{khoa}", dataList[0].khoa);
                worksheet.Cells["B3"].Value = khoaString;

                MemoryStream stream = new MemoryStream(package.GetAsByteArray());
                return stream;
            }
        }

        public MemoryStream UpdateDataIntoExcelTemplateNCM(List<ExeclDmxdUserVm> dataList, FileInfo templateFileInfo, DateTime currentDate)
        {
            using (var package = new ExcelPackage(templateFileInfo))
            {
                var worksheet = package.Workbook.Worksheets["Sheet1"];

                int templateRowIndex = 7;
                int dataRowIndex = templateRowIndex + 1;
                int stt = 1;

                // Sao chép format từ dòng template (dòng 7)
                worksheet.InsertRow(dataRowIndex, dataList.Count);
                CopyRowFormat(worksheet, templateRowIndex, dataRowIndex, dataList.Count);

                foreach (var item in dataList)
                {
                    if (item.total != "0")
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
                        stt++;
                        dataRowIndex++;
                    }
                }

                string dateString = worksheet.Cells["A4"].Value.ToString()
                    .Replace("{year}", currentDate.Year.ToString());
                worksheet.Cells["A4"].Value = dateString;

                MemoryStream stream = new MemoryStream(package.GetAsByteArray());
                return stream;
            }
        }

        private void CopyRowFormat(ExcelWorksheet worksheet, int sourceRowIndex, int targetRowIndex, int rowCount)
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

        public MemoryStream UpdateDataIntoExcelTemplateTruong(List<ExeclDmxdUserVm> dataList, FileInfo templateFileInfo, DateTime currentDate)
        {
            using (var package = new ExcelPackage(templateFileInfo))
            {
                var worksheet = package.Workbook.Worksheets["Sheet1"];

                int rowIndex = 5;
                int stt = 1;

                foreach (var item in dataList)
                {
                    worksheet.Cells[$"A{rowIndex}"].Value = stt;
                    worksheet.Cells[$"B{rowIndex}"].Value = item.userId;
                    worksheet.Cells[$"C{rowIndex}"].Value = item.ho;
                    worksheet.Cells[$"D{rowIndex}"].Value = item.ten;
                    worksheet.Cells[$"F{rowIndex}"].Value = item.tenCongTrinh;
                    worksheet.Cells[$"G{rowIndex}"].Value = item.loaiCongTrinh;
                    worksheet.Cells[$"H{rowIndex}"].Value = item.soTacGia;
                    worksheet.Cells[$"I{rowIndex}"].Value = item.dongGop;
                    worksheet.Cells[$"J{rowIndex}"].Value = item.tietChuan;
                    worksheet.Cells[$"K{rowIndex}"].Value = item.diem;
                    worksheet.Cells[$"L{rowIndex}"].Value = item.thunhap;
                    rowIndex++;
                    stt++;
                }

                string dateString = worksheet.Cells["A2"].Value.ToString()
                    .Replace("{year}", currentDate.Year.ToString());
                worksheet.Cells["A2"].Value = dateString;

                MemoryStream stream = new MemoryStream(package.GetAsByteArray());
                return stream;
            }
        }

        public MemoryStream UpdateDataIntoExcelTemplateNCV2(List<ExeclDmxdUserVm> dataList, FileInfo templateFileInfo, DateTime currentDate)
        {
            using (var package = new ExcelPackage(templateFileInfo))
            {
                var worksheet = package.Workbook.Worksheets["Sheet1"];

                int rowIndex = 4;
                int stt = 1;

                foreach (var item in dataList)
                {
                    worksheet.Cells[$"A{rowIndex}"].Value = stt;
                    worksheet.Cells[$"B{rowIndex}"].Value = item.userId;
                    worksheet.Cells[$"C{rowIndex}"].Value = item.ho;
                    worksheet.Cells[$"D{rowIndex}"].Value = item.ten;
                    worksheet.Cells[$"F{rowIndex}"].Value = item.tenCongTrinh;
                    worksheet.Cells[$"G{rowIndex}"].Value = item.loaiCongTrinh;
                    worksheet.Cells[$"H{rowIndex}"].Value = item.soTacGia;
                    worksheet.Cells[$"I{rowIndex}"].Value = item.dongGop;
                    worksheet.Cells[$"J{rowIndex}"].Value = item.tietChuan;
                    worksheet.Cells[$"K{rowIndex}"].Value = item.diem;

                    rowIndex++;
                    stt++;
                }

                string dateString = worksheet.Cells["A2"].Value.ToString()
                    .Replace("{year}", currentDate.Year.ToString());
                worksheet.Cells["A2"].Value = dateString;

                MemoryStream stream = new MemoryStream(package.GetAsByteArray());
                return stream;
            }
        }
    }
}