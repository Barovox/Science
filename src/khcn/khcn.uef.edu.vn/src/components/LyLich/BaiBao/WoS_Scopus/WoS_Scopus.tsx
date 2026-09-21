import { UserLogin } from "@/models/UserLogin";
import { ASSETS_KHCN_URL, SERVER_API_URL } from "@/utils/env";
import { Anchor, Checkbox, Table, Text } from "@mantine/core";
import axios from "axios";
import { useEffect, useState } from "react";
import ButtonThemBB from "../ButtonThemBB/ButtonThemBB";

const WoS_Scopus = ({ view }: { view?: string }) => {
  const user: UserLogin = JSON.parse(
    sessionStorage.getItem("CurrentUser") as string
  );

  const [rows, setRows] = useState<any>([]);
  const viewer = Boolean(view);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await axios.get(
        `${SERVER_API_URL}/LyLich2/GetField/${
          view ? view : user.IDUser
        }/BaiBao_ThuocWosScopus`,
        {
          headers: {
            Authorization: `Bearer ${user.Token}`,
          },
        }
      );

      if (res.status === 404) {
        console.log("Not found");
      } else if (res.status === 200) {
        const data = JSON.parse(res.data.value);
        setRows(data.length > 0 ? data : []);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleRefresh = async () => {
    await fetchData();
  };

  return (
    <>
      {!viewer && (
        <ButtonThemBB
          currentData={rows}
          field="baiBao_ThuocWosScopus"
          handleRefresh={handleRefresh}
        />
      )}

      <Table.ScrollContainer minWidth={500} mt="md">
        <Table striped highlightOnHover withTableBorder>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>STT</Table.Th>
              {[
                "Tên bài báo/báo cáo KH",
                "Số tác giả",
                "Số tác giả chính",
                "Là tác giả chính",
                "Tên tạp chí hoặc kỷ yếu khoa học (ISSN hoặc ISBN)",
                "Quốc gia",
                "Loại Tạp chí: WoS, Scopus (IF, Qi), NXB",
                "Tập, số, trang",
                "Tháng, năm công bố",
                "Link hoặc DOI của bài báo (nếu có)",
                "1. Case study/ học liệu/ bài tập/ đồ án được phát triển",
                "2. Nội dung cập nhật học phần/ cải tiến CTĐT",
                "3. Ứng dụng vào hoạt động khác",
                "Điểm tối đa của tạp chí theo công bố HDCDGSNN",
                "Điểm quy đổi",
                "Điểm giảm",
                "Điểm ứng viên",
                "Chọn công trình tính điểm (5 năm cuối)",
                "Chọn công trình tính điểm (1 năm cuối)",
              ].map((title, i) => (
                <Table.Th
                  key={i}
                  style={{
                    whiteSpace: "normal",
                    wordBreak: "break-word",
                    textAlign: "left",
                    minWidth: 150,
                  }}
                >
                  {title}
                </Table.Th>
              ))}
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {rows.map((row: any, index: number) => (
              <Table.Tr key={index}>
                <Table.Td>
                  <Text fw="bold">{index + 1}</Text>
                </Table.Td>
                <Table.Td>{row.tenBaiBao}</Table.Td>
                <Table.Td>{row.soTacGia}</Table.Td>
                <Table.Td>{row.soTacGiaChinh}</Table.Td>
                <Table.Td>
                  <Checkbox checked={row.laTacGiaChinh} onClick={undefined} />
                </Table.Td>
                <Table.Td>{row.tenTapChi}</Table.Td>
                <Table.Td>{row.quocGia}</Table.Td>
                <Table.Td>{row.loaiTapChi}</Table.Td>
                <Table.Td>{row.tapSoTrang}</Table.Td>
                <Table.Td>{row.ngayCongBo}</Table.Td>
                <Table.Td>{row.linkBaiBao}</Table.Td>
                <Table.Td>
                  {typeof row.ketQuaGiangDay === "object" && row.ketQuaGiangDay ? row.ketQuaGiangDay.caseStudy : row.ketQuaGiangDay}
                  {row.ketQuaGiangDay?.minhChung1 && <div><Anchor href={`${ASSETS_KHCN_URL}/uploads/${row.ketQuaGiangDay.minhChung1}`} target="_blank" size="xs">📎 {row.ketQuaGiangDay.minhChung1.replace(/^\d+-/, "")}</Anchor></div>}
                </Table.Td>
                <Table.Td>
                  {row.ketQuaGiangDay?.noiDungCapNhat}
                  {row.ketQuaGiangDay?.minhChung2 && <div><Anchor href={`${ASSETS_KHCN_URL}/uploads/${row.ketQuaGiangDay.minhChung2}`} target="_blank" size="xs">📎 {row.ketQuaGiangDay.minhChung2.replace(/^\d+-/, "")}</Anchor></div>}
                </Table.Td>
                <Table.Td>
                  {row.ketQuaGiangDay?.ungDungKhac}
                  {row.ketQuaGiangDay?.minhChung3 && <div><Anchor href={`${ASSETS_KHCN_URL}/uploads/${row.ketQuaGiangDay.minhChung3}`} target="_blank" size="xs">📎 {row.ketQuaGiangDay.minhChung3.replace(/^\d+-/, "")}</Anchor></div>}
                </Table.Td>
                <Table.Td>{row.diemToiDaTapChiCongBo}</Table.Td>
                <Table.Td>{row.diemQuyDoi}</Table.Td>
                <Table.Td>{row.diemGiam}</Table.Td>
                <Table.Td>{row.diemUngVien}</Table.Td>
                <Table.Td>
                  <Checkbox checked={row.cttd5nc} onClick={undefined} />
                </Table.Td>
                <Table.Td>
                  <Checkbox checked={row.cttd1nc} onClick={undefined} />
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Table.ScrollContainer>
    </>
  );
};

export default WoS_Scopus;
