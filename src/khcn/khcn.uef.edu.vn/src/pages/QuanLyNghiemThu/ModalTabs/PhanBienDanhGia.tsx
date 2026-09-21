import {
  Button,
  Paper,
  Table,
  Title,
  TypographyStylesProvider,
} from "@mantine/core";
import { IconExternalLink } from "@tabler/icons-react";

const LichSuXuLy = ({ baiBaoData }: { baiBaoData: any }) => {
  return (
    <>
      <Title order={3} mb="lg">
        Nhận xét / Đánh giá
      </Title>

      <Paper shadow="xs" withBorder p="xl">
        <Table.ScrollContainer my="md" minWidth={500}>
          <Table striped highlightOnHover withTableBorder>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>STT</Table.Th>
                <Table.Th>Người nhận xét</Table.Th>
                <Table.Th>Ý kiến gửi nhóm đề tài</Table.Th>
                <Table.Th>Ý kiến gửi Hội đồng</Table.Th>
                <Table.Th>Phiếu đánh giá</Table.Th>
                <Table.Th>Đánh giá</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {baiBaoData.hoiDongDanhGia &&
                JSON.parse(baiBaoData.hoiDongDanhGia)
                  .filter((item: any) => {
                    return item.fromHoiDongNghiemThu;
                  })
                  .map((hd: any, index: number) => {
                    return (
                      <Table.Tr key={index}>
                        <Table.Td>{index + 1}</Table.Td>
                        <Table.Td>
                          {hd.fromHoiDongNghiemThu.replace("|~|", " - ")}
                        </Table.Td>
                        <Table.Td>
                          <TypographyStylesProvider>
                            <div
                              dangerouslySetInnerHTML={{
                                __html: hd.commentForGroup,
                              }}
                            />
                          </TypographyStylesProvider>
                        </Table.Td>
                        <Table.Td>
                          <TypographyStylesProvider>
                            <div
                              dangerouslySetInnerHTML={{
                                __html: hd.commentForHoiDong,
                              }}
                            />
                          </TypographyStylesProvider>
                        </Table.Td>
                        <Table.Td>
                          <Button
                            component="a"
                            href={hd.phieuDanhGia}
                            target="_blank"
                            variant="outline"
                            rightSection={
                              <IconExternalLink stroke={1.5} size={18} />
                            }
                          >
                            Xem phiếu đánh giá
                          </Button>
                        </Table.Td>
                        <Table.Td>{hd.ketLuan}</Table.Td>
                      </Table.Tr>
                    );
                  })}
            </Table.Tbody>
          </Table>
        </Table.ScrollContainer>
      </Paper>
    </>
  );
};

export default LichSuXuLy;
