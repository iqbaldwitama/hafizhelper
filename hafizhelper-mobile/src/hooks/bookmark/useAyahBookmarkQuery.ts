import { useQuery } from "react-query";
import { fetchUserAyahBookmark } from "../../networks/bookmark/fetchUserAyahBookmark";
import { AyahBookmark } from "../../interfaces/AyahBookmark";

const useAyahBookmarkQuery = (isLoggedIn: boolean) => {
  if (!isLoggedIn) {
    return {
      data: null,
      isLoading: null,
      error: null,
      refetch: () => {},
    };
  }
  const { data, isLoading, error, refetch } = useQuery<
    AyahBookmark[],
    Error
  >("userAyahBookmark", fetchUserAyahBookmark);

  return { data, isLoading, error, refetch };
};

export default useAyahBookmarkQuery;
