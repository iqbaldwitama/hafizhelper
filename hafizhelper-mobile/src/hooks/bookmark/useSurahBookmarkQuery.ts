import { useQuery } from "react-query";
import { SurahBookmark } from "../../interfaces/SurahBookmark";
import { fetchUserSurahBookmark } from "../../networks/bookmark/fetchUserSurahBookmark";

const useSurahBookmarkQuery = (isLoggedIn: boolean) => {
  if (!isLoggedIn) {
    return {
      data: null,
      isLoading: null,
      error: null,
      refetch: () => {},
    };
  }
  const { data, isLoading, error, refetch } = useQuery<
    SurahBookmark[],
    Error
  >("userSurahBookmark", fetchUserSurahBookmark);

  return { data, isLoading, error, refetch };
};

export default useSurahBookmarkQuery;
