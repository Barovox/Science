import { Select, Space } from "@mantine/core";
import { useEffect, useState } from "react";
import TrongNuoc from "./TrongNuoc/TrongNuoc";
import QuocTe from "./QuocTe/QuocTe";

const KhenThuong = ({ type, view }: { type?: string[]; view?: string }) => {
  const [tab, setTab] = useState<string | null>("");
  const [tabs, setTabs] = useState<any>(null);

  useEffect(() => {
    getTabs();
  }, []);

  const getTabs = () => {
    if (type) {
      const tabsTemp: any = [];
      type.map((elm) => {
        if (elm === "giaiThuong_TrongNuoc") {
          tabsTemp.push({
            value: "TrongNuoc",
            label: "Giải thưởng trong nước",
          });
        } else if (elm === "giaiThuong_QuocTe") {
          tabsTemp.push({
            value: "QuocTe",
            label: "Giải thưởng quốc tế",
          });
        }
      });
      setTabs(tabsTemp);
      setTab(tabsTemp[0].value);
    } else {
      setTabs([
        { value: "TrongNuoc", label: "Giải thưởng trong nước" },
        {
          value: "QuocTe",
          label: "Giải thưởng quốc tế",
        },
      ]);
      setTab("TrongNuoc");
    }
  };

  return (
    <>
      <Select
        label="Loại hình khen thưởng"
        data={tabs}
        value={tab}
        onChange={setTab}
      />

      <Space h="md" />

      {tab === "TrongNuoc" ? (
        <TrongNuoc view={view} />
      ) : tab === "QuocTe" ? (
        <QuocTe view={view} />
      ) : (
        <></>
      )}
    </>
  );
};

export default KhenThuong;
