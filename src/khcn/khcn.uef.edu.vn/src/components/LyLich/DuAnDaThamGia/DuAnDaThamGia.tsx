import { Select, Space } from "@mantine/core";
import { useEffect, useState } from "react";
import UniversityFund from "./UniversityFund/UniversityFund";
import ProvinceGrants from "./ProvinceGrants/ProvinceGrants";
import NationalGrants from "./NationalGrants/NationalGrants";
import InternationalGrants from "./InternationalGrants/InternationalGrants";

const DuAnDaThamGia = ({ type, view }: { type?: string[]; view?: string }) => {
  const [tab, setTab] = useState<string | null>("");
  const [tabs, setTabs] = useState<any>(null);

  useEffect(() => {
    getTabs();
  }, []);

  const getTabs = () => {
    if (type) {
      const tabsTemp: any = [];
      type.map((elm) => {
        if (elm === "duAnThamGia_UniversityFund") {
          tabsTemp.push({ value: "UniversityFund", label: "University Fund" });
        } else if (elm === "duAnThamGia_ProvinceGrants") {
          tabsTemp.push({ value: "ProvinceGrants", label: "Province Grants" });
        } else if (elm === "duAnThamGia_NationalGrants") {
          tabsTemp.push({ value: "NationalGrants", label: "National Grants" });
        } else if (elm === "duAnThamGia_InternationalGrants") {
          tabsTemp.push({
            value: "InternationalGrants",
            label: "International Grants",
          });
        }
      });
      setTabs(tabsTemp);
      setTab(tabsTemp[0].value);
    } else {
      setTabs([
        { value: "UniversityFund", label: "University Fund" },
        { value: "ProvinceGrants", label: "Province Grants" },
        { value: "NationalGrants", label: "National Grants" },
        { value: "InternationalGrants", label: "International Grants" },
      ]);
      setTab("UniversityFund");
    }
  };

  return (
    <>
      <Select
        label="Loại hình dự án"
        data={tabs}
        value={tab}
        onChange={setTab}
      />

      <Space h="md" />

      {tab === "UniversityFund" ? (
        <UniversityFund view={view} />
      ) : tab === "ProvinceGrants" ? (
        <ProvinceGrants view={view} />
      ) : tab === "NationalGrants" ? (
        <NationalGrants view={view} />
      ) : tab === "InternationalGrants" ? (
        <InternationalGrants view={view} />
      ) : (
        <></>
      )}
    </>
  );
};

export default DuAnDaThamGia;
