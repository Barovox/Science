import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  publishProfiles: [],
  donViCongTacList: [],
};

const publishProfileSlice = createSlice({
  name: "publishProfile",
  initialState,
  reducers: {
    STORE_PUBLISH_PROFILES(state, action) {
      state.publishProfiles = action.payload.publishProfiles;
    },
    STORE_DON_VI_CONG_TAC_LIST(state, action) {
      state.donViCongTacList = action.payload.donViCongTacList;
    },
  },
});

export const { STORE_PUBLISH_PROFILES, STORE_DON_VI_CONG_TAC_LIST } =
  publishProfileSlice.actions;

export const selectPublishProfiles = (state: any) =>
  state.publishProfile.publishProfiles;
export const selectDonViCongTacList = (state: any) =>
  state.publishProfile.donViCongTacList;

export default publishProfileSlice.reducer;
