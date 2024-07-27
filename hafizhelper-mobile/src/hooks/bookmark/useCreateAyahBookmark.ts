import AsyncStorage from "@react-native-async-storage/async-storage";
import { createUserAyahBookmark } from "../../networks/bookmark/createUserAyahBookmark";

const useCreateAyahBookmark = async (
  surah: string,
  ayat: number,
  surah_number: number,
) => {
  try {
    const userToken = await AsyncStorage.getItem("userToken");
    if (userToken) {
      await createUserAyahBookmark(
        surah ?? "",
        ayat ?? 1,
        surah_number ?? 1,
      );
    }
    console.log("Ayah Bookmark stored successfully");
  } catch (error) {
    console.log("cek");
    console.error("Error in logging bookmark hook:", error);
  }
};

export default useCreateAyahBookmark;
