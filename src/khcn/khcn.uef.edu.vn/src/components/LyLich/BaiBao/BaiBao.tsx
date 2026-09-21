import { Select, Space } from "@mantine/core";
import { useEffect, useState } from "react";
import WoS_Scopus from "./WoS_Scopus/WoS_Scopus";
import QuocTe from "./QuocTe/QuocTe";
import HDCDGSNN from "./HDCDGSNN/HDCDGSNN";
import Conference from "./Conference/Conference";
import Book from "./Book/Book";
import BookChapter from "./BookChapter/BookChapter";
import SangChe from "./SangChe/SangChe";

const BaiBao = ({ type, view }: { type?: string[]; view?: string }) => {
  const [tab, setTab] = useState<string | null>("");
  const [tabs, setTabs] = useState<any>(null);

  useEffect(() => {
    getTabs();
  }, []);

  const getTabs = () => {
    if (type) {
      const tabsTemp: any = [];
      type.map((elm) => {
        if (elm === "baiBao_ThuocWosScopus") {
          tabsTemp.push({
            value: "WoS_Scopus",
            label: "Bài báo thuộc WoS/Scopus",
          });
        } else if (elm === "baiBao_QuocTeKhongThuocWosScopus") {
          tabsTemp.push({
            value: "QuocTe",
            label: "Bài báo quốc tế không thuộc chỉ mục WoS/Scopus",
          });
        } else if (elm === "baiBao_HDCDGSNN") {
          tabsTemp.push({ value: "HDCDGSNN", label: "Bài báo thuộc HDCDGSNN" });
        } else if (elm === "baiBao_Conference") {
          tabsTemp.push({ value: "Conference", label: "Conference" });
        } else if (elm === "baiBao_Book") {
          tabsTemp.push({ value: "Book", label: "Book" });
        } else if (elm === "baiBao_BookChapter") {
          tabsTemp.push({ value: "BookChapter", label: "Book chapter" });
        } else if (elm === "baiBao_SangChe") {
          tabsTemp.push({ value: "SangChe", label: "Sáng chế" });
        }
      });
      setTabs(tabsTemp);
      setTab(tabsTemp[0].value);
    } else {
      setTabs([
        { value: "WoS_Scopus", label: "Bài báo thuộc WoS/Scopus" },
        {
          value: "QuocTe",
          label: "Bài báo quốc tế không thuộc chỉ mục WoS/Scopus",
        },
        { value: "HDCDGSNN", label: "Bài báo thuộc HDCDGSNN" },
        { value: "Conference", label: "Conference" },
        { value: "Book", label: "Book" },
        { value: "BookChapter", label: "Book chapter" },
        { value: "SangChe", label: "Sáng chế" },
      ]);
      setTab("WoS_Scopus");
    }
  };

  return (
    <>
      <Select
        label="Loại hình bài báo khoa học"
        data={tabs}
        value={tab}
        onChange={setTab}
      />

      <Space h="md" />

      {tab === "WoS_Scopus" ? (
        <WoS_Scopus view={view} />
      ) : tab === "QuocTe" ? (
        <QuocTe view={view} />
      ) : tab === "HDCDGSNN" ? (
        <HDCDGSNN view={view} />
      ) : tab === "Conference" ? (
        <Conference view={view} />
      ) : tab === "Book" ? (
        <Book view={view} />
      ) : tab === "BookChapter" ? (
        <BookChapter view={view} />
      ) : tab === "SangChe" ? (
        <SangChe view={view} />
      ) : (
        <></>
      )}
    </>
  );
};

export default BaiBao;
