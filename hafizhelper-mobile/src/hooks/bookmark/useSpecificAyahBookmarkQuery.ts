import { useQuery } from "react-query";
import { fetchSpecificAyahBookmark } from "../../networks/bookmark/fetchSpecificAyahBookmark";
import { AyahBookmark } from "../../interfaces/AyahBookmark";

const useSpecificAyahBookmarkQuery = (
  noSurah: number,
  noAyah: number,
  isLoggedIn: boolean,
) => {
  if (!isLoggedIn) {
    return {
      flag: null,
      isLoading: null,
      isError: null,
      error: null,
      refetch: () => {},
    };
  }
  const { data, isLoading, isError, error, refetch } = useQuery<
    AyahBookmark | { error: string },
    Error
  >(["userSpecificSurahBookmark", noSurah, noAyah], () =>
    fetchSpecificAyahBookmark(noSurah, noAyah),
  );
  let flag: boolean = false;

  if (data && !("error" in data)) {
    flag = true;
  }

  return { flag, isLoading, isError, error, refetch };
};

export default useSpecificAyahBookmarkQuery;
