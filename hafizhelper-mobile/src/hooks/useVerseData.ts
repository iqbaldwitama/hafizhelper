import { useSelector, useDispatch } from "react-redux";
import { fetchVerse } from "../redux/verseSlice";
import { RootState, AppDispatch } from "../redux/store";
import { fetchVerseMadinah } from "../redux/verseMadinahSlice";

export const useVerseData = (
  suratId: number,
  arabicSetting: string,
) => {
  const dispatch = useDispatch<AppDispatch>();
  const verseData = useSelector(
    (state: RootState) => state.verse.data[suratId],
  );
  const verseLoading = useSelector(
    (state: RootState) => state.verse.isLoading,
  );
  const verseError = useSelector(
    (state: RootState) => state.verse.error,
  );
  const verseMadinahData = useSelector(
    (state: RootState) => state.verseMadinah.data[suratId],
  );
  const verseMadinahLoading = useSelector(
    (state: RootState) => state.verseMadinah.isLoading,
  );

  const loadVerses = async () => {
    console.log("load verse");
    if (!verseData) {
      dispatch(fetchVerse(suratId));
    }
    if (!verseMadinahData && arabicSetting === "01") {
      dispatch(fetchVerseMadinah(suratId));
    }
  };

  return {
    verseData,
    verseLoading,
    verseError,
    verseMadinahData,
    verseMadinahLoading,
    loadVerses,
  };
};
