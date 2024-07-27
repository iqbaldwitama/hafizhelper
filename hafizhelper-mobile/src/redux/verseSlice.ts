import {
  createSlice,
  createAsyncThunk,
  PayloadAction,
} from "@reduxjs/toolkit";
import { fetchVerseList } from "../networks/ayat/fetchVerseList";
import { VerseData } from "../interfaces/Verse";

export const fetchVerse = createAsyncThunk(
  "verse/fetchVerse",
  async (
    suratId: number,
  ): Promise<{ suratId: number; data: VerseData }> => {
    const response = await fetchVerseList(suratId);
    if (response.data) {
      return { suratId, data: response.data };
    }
    throw new Error("No data found");
  },
);

export interface VerseState {
  data: Record<number, VerseData | undefined>;
  isLoading: boolean;
  error: string | null;
}

const initialState: VerseState = {
  data: {},
  isLoading: false,
  error: null,
};

export const verseSlice = createSlice({
  name: "verse",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchVerse.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        fetchVerse.fulfilled,
        (
          state,
          action: PayloadAction<{ suratId: number; data: VerseData }>,
        ) => {
          state.isLoading = false;
          state.error = null;
          state.data[action.payload.suratId] = action.payload.data;
        },
      )
      .addCase(fetchVerse.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || null;
      });
  },
});

export default verseSlice.reducer;
