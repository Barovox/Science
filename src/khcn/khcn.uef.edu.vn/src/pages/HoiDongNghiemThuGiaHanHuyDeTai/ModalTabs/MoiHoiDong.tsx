import {
  Blockquote,
  Paper,
  SegmentedControl,
  Text,
  Title,
} from "@mantine/core";
import { useState } from "react";
import * as MoiPbTabs from "./MoiPbTabs";

const MoiHoiDong = ({
  baiBaoData,
  onRefresh,
  isMultiBB = false,
  danhSachBaiBao = [],
}: {
  baiBaoData: any;
  onRefresh: () => Promise<void>;
  isMultiBB?: boolean;
  danhSachBaiBao?: any[];
}) => {
  const [tab, setTab] = useState("tim-kiem");

  return (
    <>
      <Title order={3}>Mời nghiệm thu</Title>

      <Blockquote color="blue" my="md">
        <Text>
          Vui lòng nhập vào ô <strong>"Tìm kiếm"</strong> để mời nghiệm thu.
        </Text>
        <Text>
          Trong trường hợp người nghiệm thu chưa có trên hệ thống, Biên tập
          chuyên môn vào <strong>"Tạo tài khoản"</strong> để tạo tài khoản cho
          họ và mời nghiệm thu.
        </Text>
      </Blockquote>

      <SegmentedControl
        value={tab}
        onChange={setTab}
        data={[
          { label: "Tìm kiếm", value: "tim-kiem" },
          { label: "Tạo tài khoản", value: "tao-tai-khoan" },
        ]}
        mb="md"
      />

      <Paper shadow="xs" withBorder p="xl">
        {tab === "tim-kiem" && (
          <MoiPbTabs.TimKiem
            baiBaoData={baiBaoData}
            onRefresh={onRefresh}
            isMultiBB={isMultiBB}
            danhSachBaiBao={danhSachBaiBao}
          />
        )}
        {tab === "tao-tai-khoan" && (
          <MoiPbTabs.TaoTaiKhoan
            baiBaoData={baiBaoData}
            isMultiBB={isMultiBB}
            danhSachBaiBao={danhSachBaiBao}
          />
        )}
      </Paper>
    </>
  );
};

export default MoiHoiDong;
