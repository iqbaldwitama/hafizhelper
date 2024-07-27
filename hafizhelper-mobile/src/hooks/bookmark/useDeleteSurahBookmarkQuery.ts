import AsyncStorage from "@react-native-async-storage/async-storage";
import { deleteSpecificsurahBookmark } from "../../networks/bookmark/deleteSpecificSurahBookmark";

const useDeleteSurahBookmarkQuery = async (noSurah: number) => {
  try {
    const userToken = await AsyncStorage.getItem("userToken");
    if (userToken) {
      await deleteSpecificsurahBookmark(noSurah ?? 1);
    }
    console.log("Surah Bookmark deleted successfully");
  } catch (error) {
    console.error("Error in logging bookmark hook:", error);
  }
};

export default useDeleteSurahBookmarkQuery;
