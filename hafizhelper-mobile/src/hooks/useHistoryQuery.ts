import { useQuery } from "react-query";
import { History } from "../interfaces/History";
import { fetchUserHistory } from "../networks/history/fetchUserHistory";

const useHistoryQuery = (isLoggedIn: boolean) => {
  if (!isLoggedIn) {
    return {
      data: null,
      isLoading: null,
      error: null,
      refetch: () => {},
    };
  }
  const { data, isLoading, error, refetch } = useQuery<
    History[],
    Error
  >("userHistory", fetchUserHistory);

  return { data, isLoading, error, refetch };
};

export default useHistoryQuery;
