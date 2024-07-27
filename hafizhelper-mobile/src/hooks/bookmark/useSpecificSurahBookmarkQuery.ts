import { useQuery } from "react-query";
import { SurahBookmark } from "../../interfaces/SurahBookmark";
import { fetchSpecificSurahBookmark } from "../../networks/bookmark/fetchSpecificSurahBookmark";

const useSpecificSurahBookmarkQuery = (
  noSurah: number,
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
    SurahBookmark | { error: string },
    Error
  >(["userSpecificSurahBookmark", noSurah], () =>
    fetchSpecificSurahBookmark(noSurah),
  );
  let flag: boolean = false;

  if (data && !("error" in data)) {
    flag = true;
  }

  return { flag, isLoading, isError, error, refetch };
};

export default useSpecificSurahBookmarkQuery;
