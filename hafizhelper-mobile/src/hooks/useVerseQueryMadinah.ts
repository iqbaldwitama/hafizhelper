import { useQuery } from "react-query";
import { fetchVerseListMadinah } from "../networks/ayat/fetchVerseListMadinah";
import { VerseMadinahData } from "../interfaces/VerseMadinah";

const useVerseQueryMadinah = (suratId: number) => {
  const { data, isLoading, error, refetch } = useQuery<
    VerseMadinahData,
    Error
  >(["verseMadinah", suratId], () => fetchVerseListMadinah(suratId), {
    enabled: !!suratId,
  });
  return { data, isLoading, error, refetch };
};

export default useVerseQueryMadinah;
