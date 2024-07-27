import { useQuery } from "react-query";
import { fetchVerseList } from "../networks/ayat/fetchVerseList";
import { VerseResponse } from "../interfaces/Verse";

const useVerseQuery = (suratId: number) => {
  const { data, isLoading, error, refetch } = useQuery<
    VerseResponse,
    Error
  >(["verse", suratId], () => fetchVerseList(suratId), {
    enabled: !!suratId,
  });
  return { data, isLoading, error, refetch };
};

export default useVerseQuery;
