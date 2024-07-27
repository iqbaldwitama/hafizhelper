import AsyncStorage from "@react-native-async-storage/async-storage";
import { deleteSpecificAyahBookmark } from "../../networks/bookmark/deleteSpecificAyahBookmark";

const useDeleteAyahBookmarkQuery = async (
  noSurah: number,
  noAyah: number,
) => {
  try {
    const userToken = await AsyncStorage.getItem("userToken");
    if (userToken) {
      await deleteSpecificAyahBookmark(noSurah ?? 1, noAyah ?? 1);
    }
    console.log("Ayah Bookmark deleted successfully");
  } catch (error) {
    console.error("Error in logging bookmark hook:", error);
  }
};

export default useDeleteAyahBookmarkQuery;
