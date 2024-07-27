import {
  createSlice,
  createAsyncThunk,
  PayloadAction,
} from "@reduxjs/toolkit";
import { VerseMadinahData } from "../interfaces/VerseMadinah";
import { fetchVerseListMadinah } from "../networks/ayat/fetchVerseListMadinah";

export const fetchVerseMadinah = createAsyncThunk(
  "verseMadinah/fetchVerseMadinah",
  async (
    suratId: number,
  ): Promise<{ suratId: number; data: VerseMadinahData }> => {
    const response = await fetchVerseListMadinah(suratId);
    if (response) {
      return { suratId, data: response };
    }
    throw new Error("No data found");
  },
  // async (suratId: number): Promise<VerseMadinahData> => {
  //   const response = await fetchVerseListMadinah(suratId);
  //   if (response.data) {
  //     return response.data;
  //   }
  //   throw new Error("No data found");
  // },
);

export interface VerseMadinahState {
  data: Record<number, VerseMadinahData | undefined>;
  isLoading: boolean;
  error: string | null;
}

const initialState: VerseMadinahState = {
  data: {},
  isLoading: false,
  error: null,
};

const verseMadinahSlice = createSlice({
  name: "verseMadinah",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchVerseMadinah.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        fetchVerseMadinah.fulfilled,
        (
          state,
          action: PayloadAction<{
            suratId: number;
            data: VerseMadinahData;
          }>,
        ) => {
          state.isLoading = false;
          state.error = null;
          state.data[action.payload.suratId] = action.payload.data;
        },
      )
      .addCase(fetchVerseMadinah.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message ?? null;
      });
  },
});

export default verseMadinahSlice.reducer;
