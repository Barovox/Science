import PaginationComponent from "@/components/Pagination/Pagination";
import { ASSETS_KHCN_URL } from "@/utils/env";
import {
  Avatar,
  Button,
  Center,
  CloseButton,
  Divider,
  Grid,
  Group,
  Paper,
  Select,
  Text,
  TextInput,
} from "@mantine/core";
import { useViewportSize } from "@mantine/hooks";
import { IconMail, IconPhone, IconSearch } from "@tabler/icons-react";
import { useEffect, useState } from "react";

const ProfileList = ({
  publishProfiles,
  search,
  setSearch,
  sort,
  // @ts-ignore
  setSort,
}: any) => {
  // Pagination state
  const [currentPage, setCurrentPage] = useState<number>(() => {
    const pageParam = new URLSearchParams(window.location.search).get("page");
    const parsed = parseInt(pageParam ?? "1", 10);
    return isNaN(parsed) ? 1 : parsed;
  });
  const { width } = useViewportSize();
  const personsPerPage = width > 768 ? 9 : 8; // màn hình lớn hiển thị 9 người (3 cột), màn hình nhỏ hiển thị 8 người (2 cột)
  // Get current profiles
  const indexOfLastPerson = currentPage * personsPerPage;
  const indexOfFirstPerson = indexOfLastPerson - personsPerPage;
  const currentProfiles = publishProfiles.slice(
    indexOfFirstPerson,
    indexOfLastPerson
  );

  useEffect(() => {
    const pageParam = new URLSearchParams(window.location.search).get("page");
    // Nếu trang hiện tại lớn hơn tổng số trang thì chuyển về trang 1
    if (pageParam) {
      const parsedPage = parseInt(pageParam, 10);
      setCurrentPage(isNaN(parsedPage) ? 1 : parsedPage);
    } else {
      setCurrentPage(1);
    }
  }, []);

  const appendSearch = (e: any) => {
    e.preventDefault();

    const params = new URLSearchParams(window.location.search);
    params.delete("page");
    params.delete("search");
    params.append("page", "1");
    params.append("search", search);
    window.location.replace(`${window.location.pathname}?${params.toString()}`);
  };

  const appendSort = (sort: string) => {
    const params = new URLSearchParams(window.location.search);
    params.delete("sort");
    params.delete("page");
    params.append("page", "1");
    params.append("sort", sort);
    window.location.replace(`${window.location.pathname}?${params.toString()}`);
  };

  return (
    <>
      <Group justify="space-between">
        <form onSubmit={appendSearch}>
          <Group>
            <TextInput
              leftSectionPointerEvents="none"
              leftSection={<IconSearch />}
              rightSectionPointerEvents="all"
              rightSection={
                search && (
                  <CloseButton
                    aria-label="Xóa nội dung"
                    onClick={() => setSearch("")}
                  />
                )
              }
              placeholder="Tìm kiếm hồ sơ"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Button type="submit">Tìm</Button>
          </Group>
        </form>
        <Select
          label="Sắp xếp theo"
          placeholder="Sắp xếp theo"
          data={["Mã giảng viên (A-Z)", "Mã giảng viên (Z-A)"]}
          value={sort}
          onChange={(value: any) => appendSort(value)}
          allowDeselect={false}
        />
      </Group>

      <Divider size="md" mt="md" mb="md" />

      {publishProfiles.length === 0 ? (
        <Text>Không tìm thấy hồ sơ công khai nào.</Text>
      ) : (
        <>
          <Grid>
            {currentProfiles.map((person: any, index: any) => {
              return (
                <Grid.Col span={{ base: 6, md: 4 }} key={index}>
                  <Paper
                    component="a"
                    href={`/u/${person.idLyLich}`}
                    radius="md"
                    withBorder
                    p="lg"
                    bg="var(--mantine-color-body)"
                    shadow="sm"
                  >
                    <Avatar
                      src={`${ASSETS_KHCN_URL}/avatars/${
                        person.idLyLich
                      }.png?t=${Date.now()}`} // sử dụng query string để tránh cache
                      size={120}
                      radius={120}
                      mx="auto"
                      name={person.hoTen}
                      color="initials"
                    />

                    <Text
                      ta="center"
                      fz="lg"
                      fw={500}
                      mt="md"
                      style={{ color: "var(--mantine-color-text)" }}
                    >
                      {person.hoTen}
                    </Text>
                    <Text ta="center" c="dimmed" fz="sm">
                      {person.idLyLich} • {person.hocHam} • {person.chucVu}
                    </Text>

                    <Text ta="center" c="dimmed" fz="sm" mt="md">
                      <Center inline>
                        <IconMail size={18} stroke={1.5} /> {person.email}
                      </Center>
                    </Text>
                    <Text ta="center" c="dimmed" fz="sm">
                      <Center inline>
                        <IconPhone size={18} stroke={1.5} /> {person.sdt}
                      </Center>
                    </Text>
                  </Paper>
                </Grid.Col>
              );
            })}
          </Grid>

          <Divider size="md" mt="md" />

          <Center mt="md">
            {publishProfiles.length === 0 ? null : (
              <>
                <PaginationComponent
                  currentPage={currentPage}
                  setCurrentPage={setCurrentPage}
                  itemsPerPage={personsPerPage}
                  totalItems={publishProfiles.length}
                />
              </>
            )}
          </Center>
        </>
      )}
    </>
  );
};

export default ProfileList;
