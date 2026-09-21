import { Select, Space } from "@mantine/core";
import { useEffect, useState } from "react";
import Master from "./Master/Master";
import PhD from "./PhD/PhD";
import Postdoc from "./Postdoc/Postdoc";

const HuongDan = ({ type, view }: { type?: string[]; view?: string }) => {
  const [tab, setTab] = useState<string | null>("");
  const [tabs, setTabs] = useState<any>(null);

  useEffect(() => {
    getTabs();
  }, []);

  const getTabs = () => {
    if (type) {
      const tabsTemp: any = [];
      type.map((elm) => {
        if (elm === "huongDan_Master") {
          tabsTemp.push({ value: "Master", label: "Master" });
        } else if (elm === "huongDan_PhD") {
          tabsTemp.push({ value: "PhD", label: "PhD" });
        } else if (elm === "huongDan_Postdoc") {
          tabsTemp.push({ value: "Postdoc", label: "Postdoc" });
        }
      });
      setTabs(tabsTemp);
      setTab(tabsTemp[0].value);
    } else {
      setTabs([
        { value: "Master", label: "Master" },
        { value: "PhD", label: "PhD" },
        { value: "Postdoc", label: "Postdoc" },
      ]);
      setTab("Master");
    }
  };

  return (
    <>
      <Select
        label="Loại hình hướng dẫn"
        data={tabs}
        value={tab}
        onChange={setTab}
      />

      <Space h="md" />

      {tab === "Master" ? (
        <Master view={view} />
      ) : tab === "PhD" ? (
        <PhD view={view} />
      ) : tab === "Postdoc" ? (
        <Postdoc view={view} />
      ) : (
        <></>
      )}
    </>
  );
};

export default HuongDan;
