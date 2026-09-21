import { selectDonViCongTacList } from "@/redux/slice/publishProfileSlice";
import {
  Button,
  Checkbox,
  CloseButton,
  Fieldset,
  Group,
  ScrollArea,
  TextInput,
} from "@mantine/core";
import { IconFilter, IconFilterOff, IconListSearch } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const ProfilesFilter = () => {
  const [queryUnit, setQueryUnit] = useState("");
  const [donViCongTac, setDonViCongTac] = useState<string[]>([]);
  const donViCongTacList = useSelector(selectDonViCongTacList);

  const dvctFiltered = donViCongTacList.filter((item: string) =>
    item.toLowerCase().includes(queryUnit.toLowerCase())
  );

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    const donViCongTac = params.get("donViCongTac");
    if (donViCongTac) {
      setDonViCongTac(donViCongTac.split(",")); // Chuyển chuỗi thành mảng
    }
  }, []);

  const appendFilter = (e: any) => {
    e.preventDefault();

    const params = new URLSearchParams(window.location.search);

    params.delete("donViCongTac");
    params.delete("page");

    if (donViCongTac.length > 0) {
      params.append("donViCongTac", donViCongTac.join(","));
    }
    params.append("page", "1");

    window.location.replace(`${window.location.pathname}?${params.toString()}`);
  };

  const clearFilter = () => {
    const params = new URLSearchParams(window.location.search);
    params.delete("donViCongTac");
    params.delete("page");

    params.append("page", "1");

    setDonViCongTac([]);

    window.location.replace(`${window.location.pathname}?${params.toString()}`);
  };

  return (
    <>
      <form onSubmit={appendFilter}>
        <Fieldset legend="Đơn vị công tác" variant="filled" radius="md">
          <TextInput
            rightSectionPointerEvents={queryUnit ? "all" : "none"}
            rightSection={
              queryUnit ? (
                <CloseButton
                  aria-label="Xóa nội dung"
                  onClick={() => setQueryUnit("")}
                />
              ) : (
                <IconListSearch />
              )
            }
            placeholder="Tìm đơn vị"
            value={queryUnit}
            onChange={(e) => setQueryUnit(e.currentTarget.value)}
          />
          <ScrollArea h={175} offsetScrollbars scrollHideDelay={0}>
            <Checkbox.Group value={donViCongTac} onChange={setDonViCongTac}>
              {dvctFiltered.map((dvct: any, index: any) => {
                return (
                  <Checkbox
                    mt="xs"
                    key={dvct + "_" + index}
                    label={dvct}
                    value={dvct}
                  />
                );
              })}
            </Checkbox.Group>
          </ScrollArea>
        </Fieldset>

        <Group mt="md" justify="center">
          <Button leftSection={<IconFilter size={14} />} type="submit">
            Lọc
          </Button>
          <Button
            leftSection={<IconFilterOff size={14} />}
            variant="outline"
            onClick={clearFilter}
          >
            Xóa lọc
          </Button>
        </Group>
      </form>
    </>
  );
};

export default ProfilesFilter;
