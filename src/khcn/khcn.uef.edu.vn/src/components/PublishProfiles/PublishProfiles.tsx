import { useEffect, useMemo, useState } from "react";
import PageLoader from "../PageLoader/PageLoader";
import { useDispatch, useSelector } from "react-redux";
import { SERVER_API_URL } from "@/utils/env";
import axios from "axios";
import { UserLogin } from "@/models/UserLogin";
import {
  STORE_DON_VI_CONG_TAC_LIST,
  STORE_PUBLISH_PROFILES,
} from "@/redux/slice/publishProfileSlice";
import {
  QUERY_PUBLISH_PROFILES,
  selectFilteredPublishProfiles,
} from "@/redux/slice/filterSlice";
import { Grid } from "@mantine/core";
import ProfilesFilter from "./ProfilesFilter/ProfilesFilter";
import ProfileList from "./ProfileList/ProfileList";

const PublishProfiles = () => {
  const user: UserLogin = JSON.parse(
    sessionStorage.getItem("CurrentUser") as string
  );

  const [isLoading, setIsLoading] = useState(true);
  // @ts-ignore
  const [donViCongTacList, setDonViCongTacList] = useState<string[]>([]);
  const [publishProfiles, setPublishProfiles] = useState<any[]>([]);
  const [search, setSearch] = useState<string>("");
  const [sort, setSort] = useState<string>("Mã giảng viên (A-Z)");
  const [dataLoaded, setDataLoaded] = useState(false); // Trạng thái kiểm tra dữ liệu đã tải xong chưa
  const filteredPublishProfiles = useSelector(selectFilteredPublishProfiles);

  const dispatch = useDispatch();
  const searchParams = useMemo(
    () => new URLSearchParams(window.location.search),
    [window.location.search]
  );

  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([fetchDonViCongTacList(), fetchPublishProfiles()]);
      setDataLoaded(true); // Đánh dấu dữ liệu đã tải xong
    };
    fetchData();
  }, []); // chỉ chạy 1 lần sau khi render lần đầu

  useEffect(() => {
    if (!dataLoaded) return; // Chỉ chạy khi dữ liệu đã sẵn sàng

    const search = searchParams.get("search");
    const sort = searchParams.get("sort");
    const donViCongTac = searchParams.get("donViCongTac");

    if (search) {
      setSearch(search);
    }
    if (sort) {
      setSort(sort);
    }
    dispatch(
      QUERY_PUBLISH_PROFILES({ publishProfiles, search, donViCongTac, sort })
    );
    setIsLoading(false);
  }, [dispatch, searchParams, dataLoaded]);

  const fetchDonViCongTacList = async () => {
    try {
      const result = await axios.get(
        `${SERVER_API_URL}/DanhMucXetDuyet/GetAll-DonViCongTac`,
        {
          headers: {
            Authorization: `Bearer ${user.Token}`,
          },
        }
      );
      if (result.status === 200) {
        const arrayData: string[] = result.data;
        const uniqueDonViCongTac: string[] = Array.from(
          new Set(
            arrayData
              .filter(
                (item: string): item is string =>
                  item != null && !item.startsWith("NCM")
              )
              .map((item: string) => item.split(",")[0])
          )
        );
        setDonViCongTacList(uniqueDonViCongTac);
        dispatch(
          STORE_DON_VI_CONG_TAC_LIST({ donViCongTacList: uniqueDonViCongTac })
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchPublishProfiles = async () => {
    try {
      const result = await axios.get(
        `${SERVER_API_URL}/LyLich2/GetUsersWithPublicData`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.Token}`,
          },
        }
      );
      if (result.status == 200) {
        const publishProfiles = result.data.map((person: any) => {
          const u = JSON.parse(person.thongTinChung);
          return { idLyLich: person.idLyLich, ...u };
        });
        setPublishProfiles(publishProfiles);
        dispatch(STORE_PUBLISH_PROFILES({ publishProfiles: publishProfiles }));
      }
    } catch (error: any) {
      console.log(error.response);
    }
  };

  return (
    <>
      {isLoading ? (
        <PageLoader />
      ) : (
        <>
          <Grid>
            <Grid.Col span={{ base: 12, md: 3 }}>
              <ProfilesFilter />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 9 }}>
              <ProfileList
                publishProfiles={filteredPublishProfiles}
                search={search}
                setSearch={setSearch}
                sort={sort}
                setSort={setSort}
              />
            </Grid.Col>
          </Grid>
        </>
      )}
    </>
  );
};

export default PublishProfiles;
