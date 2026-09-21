import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  filteredPublishProfiles: [],
  filteredNotifications: [],
  filteredBaiBao: [],
  filteredHoiDongKhoaHoc: [],
};

const filterSlice = createSlice({
  name: "filter",
  initialState,
  reducers: {
    QUERY_PUBLISH_PROFILES(state, action) {
      const { publishProfiles, search, donViCongTac, sort } = action.payload;
      let tempPublishProfiles: any = [];

      // console.log("publishProfiles", publishProfiles);
      // console.log("search", search);
      // console.log("donViCongTac", donViCongTac);
      // console.log("sort", sort);

      const listDonViCongTac = donViCongTac != null && donViCongTac.split(",");

      if (!listDonViCongTac && !sort && !search) {
        tempPublishProfiles = publishProfiles;
      } else {
        tempPublishProfiles = publishProfiles;
        // console.log("start: ", tempPublishProfiles);

        // params: search
        if (search) {
          tempPublishProfiles = tempPublishProfiles.filter((profile: any) => {
            return (
              profile.idLyLich.toLowerCase().includes(search.toLowerCase()) ||
              profile.hoTen.toLowerCase().includes(search.toLowerCase())
            );
          });
        }
        // console.log("search: ", tempPublishProfiles);

        // params: sort
        if (sort === "Mã giảng viên (A-Z)") {
          tempPublishProfiles = tempPublishProfiles
            .slice()
            .sort((a: any, b: any) => {
              return a.idLyLich.localeCompare(b.idLyLich);
            });
        } else if (sort === "Mã giảng viên (Z-A)") {
          tempPublishProfiles = tempPublishProfiles
            .slice()
            .sort((a: any, b: any) => {
              return b.idLyLich.localeCompare(a.idLyLich);
            });
        }
        // console.log("sort: ", tempPublishProfiles);

        // params: donViCongTac
        if (listDonViCongTac) {
          tempPublishProfiles = tempPublishProfiles.filter((profile: any) =>
            listDonViCongTac.includes(profile.donViCongTac)
          );
        }
        // console.log("donViCongTac: ", tempPublishProfiles);
      }

      // console.log("result: ", tempPublishProfiles);
      state.filteredPublishProfiles = tempPublishProfiles;
    },
    FILTER_BY_SEARCH_NOTIFICATIONS(state, action) {
      const { notifications, search } = action.payload;
      const tempNotifications = notifications.filter((notify: any) =>
        notify.message.toLowerCase().includes(search.toLowerCase())
      );

      state.filteredNotifications = tempNotifications;
    },
    FILTER_BY_SEARCH_BAI_BAO(state, action) {
      const { baiBao, search } = action.payload;
      const tempBaiBao = baiBao.filter((bb: any) =>
        bb.tenBaiBao.toLowerCase().includes(search.toLowerCase())
      );

      state.filteredBaiBao = tempBaiBao;
    },
    FILTER_BY_SEARCH_HOI_DONG_KHOA_HOC(state, action) {
      const { hoiDongKhoaHoc, search } = action.payload;
      const tempHoiDongKhoaHoc = hoiDongKhoaHoc.filter(
        (u: any) =>
          u.email.toLowerCase().includes(search.toLowerCase()) ||
          u.hoTen.toLowerCase().includes(search.toLowerCase())
      );

      state.filteredHoiDongKhoaHoc = tempHoiDongKhoaHoc;
    },
  },
});

export const {
  QUERY_PUBLISH_PROFILES,
  FILTER_BY_SEARCH_NOTIFICATIONS,
  FILTER_BY_SEARCH_BAI_BAO,
  FILTER_BY_SEARCH_HOI_DONG_KHOA_HOC,
} = filterSlice.actions;

export const selectFilteredPublishProfiles = (state: any) =>
  state.filter.filteredPublishProfiles;
export const selectFilteredNotifications = (state: any) =>
  state.filter.filteredNotifications;
export const selectFilteredBaiBao = (state: any) => state.filter.filteredBaiBao;
export const selectFilteredHoiDongKhoaHoc = (state: any) =>
  state.filter.filteredHoiDongKhoaHoc;

export default filterSlice.reducer;
